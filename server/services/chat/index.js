
import { Op } from 'sequelize';
import {
  dateToRelativeTime,
  setDateToTimezone,
  setDateAndTZ,
} from '@carecru/isomorphic';
import { Account, Chat, Patient, TextMessage } from 'CareCruModels';
import { namespaces } from '../../config/globals';
import { sendSMS } from '../sms';
import logger from '../../config/logger';
import { handleResponse } from '../../lib/comms/util/responseChecks';
import { confirmReminderIfExist } from '../../lib/reminders/helpers';
import normalize from '../../routes/_api/normalize';
import { getPatientFromCellPhoneNumber } from '../../lib/contactInfo/getPatientFromCellPhoneNumber';
import getRelevantSocketUpdateData from './socketUpdateData';
import produceOutsideOfficeHours from '../../lib/schedule/produceOutsideOfficeHours';
import { NEW_MESSAGE, UPDATE_CHAT, MARK_READ, MARK_UNREAD } from './consts';
import getNextStartTime from '../../lib/schedule/handleNextStartTimeOpenDays';
import fetchAndComputeFinalDailySchedules from '../../lib/schedule/fetchAndComputeFinalDailySchedules';
import { isLimitReachedForPhoneNumber } from '../schedule/limitOutOfOfficeHoursReplays';
import getConfirmationText from '../../lib/reminders/reminderTemplate/getConfirmationText';

/**
 * Handles receiving a message.
 * Stores text message.
 * Confirm appointment.
 *
 * @param account {Account} Account that the message is received for
 * @param textMessageData {Object} Sanitized text message data
 * @returns {Promise}
 */
export async function receiveMessage(account, textMessageData) {
  const { from, body } = textMessageData;
  // Grab account from incoming number so that we can get accountId
  const patient = await getPatientFromCellPhoneNumber({
    accountId: account.id,
    cellPhoneNumber: from,
  });

  const chatClean = await getOrCreateChatForPatient(account.id, from, patient);
  logger.debug(`Chat ${chatClean.id} found or created.`);
  const textMessage = await storeTextMessage(
    {
      ...textMessageData,
      ...{ chatId: chatClean.id },
    },
    true,
  );

  logger.debug(`TextMessage ${textMessage.get('id')} stored.`);
  const { isConfirmation, haveExtraMessage } = handleResponse(body);

  if (!patient || !isConfirmation) {
    logger.debug(
      `Not a ${!patient ? 'patient' : 'sms confirmation'}, exiting.`,
    );
    await updateUserViaSocket(chatClean.id);
    return replyWithOutOfOfficeMessage(
      account,
      (patient && patient.get('cellPhoneNumber')) || from,
    );
  }

  // Mark text message and chat as unread if is only confirmation
  if (!haveExtraMessage) {
    await markMessageAsRead(textMessage.get('id'));
    await setChatUnread(chatClean.id, false);
  }

  // Confirm most recent available reminder for the closest appointment
  const sentReminders = await confirmReminderIfExist(account.id, patient.id);
  const lastSentReminder = sentReminders[0];

  if (
    !lastSentReminder ||
    lastSentReminder.sentRemindersPatients.length === 0
  ) {
    logger.debug('No reminders to confirm, exiting.');
    await updateUserViaSocket(chatClean.id);
    return (
      haveExtraMessage &&
      replyWithOutOfOfficeMessage(
        account,
        (patient && patient.get('cellPhoneNumber')) || from,
      )
    );
  }

  const { reminder, sentRemindersPatients } = lastSentReminder;
  const pocPatient = sentRemindersPatients.find(
    ({ appointment: a }) => a.patientId === lastSentReminder.contactedPatientId,
  );

  logger.debug(`Reminder ${lastSentReminder.id} confirmed.`);
  const sentReminderClean = lastSentReminder.get({ plain: true });
  const normalizedReminder = normalize('sentReminder', sentReminderClean);
  publishEvent(account.id, 'create:SentReminder', normalizedReminder);

  const confirmationText = await getConfirmationText({
    patient,
    appointment: pocPatient ? pocPatient.appointment : {},
    account,
    reminder,
    isFamily: sentReminderClean.isFamily,
    sentRemindersPatients,
  });

  const outOfOfficeMessage = await produceOutsideOfficeHours(
    account,
    patient.get('cellPhoneNumber') || from,
  );

  const shouldSendOutOfOfficeMessage =
    outOfOfficeMessage &&
    !(await isLimitReachedForPhoneNumber(account.id, from));

  const messageBody =
    shouldSendOutOfOfficeMessage && haveExtraMessage
      ? [confirmationText, outOfOfficeMessage].join(' ')
      : confirmationText;

  const confirmationTextMessage = await createChatMessage(
    messageBody,
    patient,
    null,
    chatClean.id,
  );

  logger.debug(`Sent ${confirmationTextMessage.id} confirmation message.`);
  await updateUserViaSocket(chatClean.id);
}

/**
 * Send the out of office message if required.
 * @param account
 * @param from
 * @return {Promise<*|boolean|TextMessage>}
 */
export async function replyWithOutOfOfficeMessage(account, from) {
  const outOfOfficeMessage = await produceOutsideOfficeHours(account, from);
  const shouldSend =
    outOfOfficeMessage &&
    !(await isLimitReachedForPhoneNumber(account.id, from));
  const replay =
    shouldSend && (await sendMessage(from, outOfOfficeMessage, account.id));
  if (replay) {
    await markMessageAsAutoReply(replay.id);
  }
  return replay;
}

/**
 * Sends a message to the user.
 * A function that encapsulates createTextMessage and requires less parameters for easier use
 * generally.
 *
 * @param cellPhoneNumber {string} Patient's phone number we are sending a message to.
 * @param message {string} Message content.
 * @param accountId {string} Id of the account.
 * @param user {string|null} An id of user that is sending a message.
 * @returns {Promise}
 */
export async function sendMessage(
  cellPhoneNumber,
  message,
  accountId,
  user = null,
) {
  const patient =
    (await getPatientFromCellPhoneNumber({
      accountId,
      cellPhoneNumber,
    })) || unknownPatient(accountId, cellPhoneNumber);

  const chat =
    (await Chat.findOne({
      raw: true,
      where: {
        patientId: patient.id,
        patientPhoneNumber: cellPhoneNumber,
      },
    })) ||
    (await Chat.findOne({
      raw: true,
      where: {
        patientId: null,
        patientPhoneNumber: cellPhoneNumber,
        accountId,
      },
    }));

  const chatId = chat ? chat.id : null;
  return createChatMessage(message, patient, user, chatId);
}

/**
 * Marks messages as unread.
 *
 * @param chatId {string} Id of the chat we are updating.
 * @param textMessageCreatedAt {string} The exact date after which we are setting messages
 * as unread.
 * @param phoneNumber {string} Phone number of the patient.
 * @returns {Promise}
 */
export async function markMessagesAsUnread(
  chatId,
  textMessageCreatedAt,
  phoneNumber,
) {
  await TextMessage.update(
    { read: false },
    {
      where: {
        chatId,
        to: phoneNumber,
        createdAt: {
          [Op.gte]: setDateToTimezone(
            textMessageCreatedAt,
            'America/Vancouver',
          ).toDate(),
        },
      },
    },
  );
  await setChatUnread(chatId);

  return updateUserViaSocket(chatId, MARK_UNREAD);
}

/**
 * Set chat's messages as read.
 *
 * @param chatId {string} Id of the chat we are marking as read.
 * @returns {Promise}
 */
export async function markMessagesAsRead(chatId) {
  await TextMessage.update(
    { read: true },
    {
      where: {
        chatId,
        read: false,
      },
    },
  );

  await setChatUnread(chatId, false);

  return updateUserViaSocket(chatId, MARK_READ);
}

/**
 * Mark signel text message as read.
 * @param id
 * @returns {Promise}
 */
export function markMessageAsRead(id) {
  return TextMessage.update({ read: true }, { where: { id } });
}

/**
 * Mark message as the outside office hours respond.
 * @param id
 * @return {Promise}
 */
export function markMessageAsAutoReply(id) {
  return TextMessage.update(
    { isOutsideOfficeHoursRespond: true },
    { where: { id } },
  );
}

/**
 * Updates a Chat instance.
 *
 * @param id {string} Chat id we are updating
 * @param data {string} Data we are updating.
 * @returns {Promise}
 */
export async function updateChat(id, data) {
  await Chat.update(data, { where: { id } });
  return updateUserViaSocket(id, UPDATE_CHAT);
}

/**
 * Resend a fail-to-send message
 * @param messageId {string} id of the message we are trying to resend.
 * @param patientId {string} id of the patient we are trying to resend a message to.
 * @return {Promise}
 */
export async function resendMessage(messageId, patientId) {
  const [oldMessage, patient] = await Promise.all([
    TextMessage.findByPk(messageId),
    Patient.findByPk(patientId, { raw: true }),
  ]);
  const newMessage = createChatMessage(
    oldMessage.get('body'),
    patient,
    oldMessage.get('userId'),
    oldMessage.get('chatId'),
  );
  await oldMessage.destroy();
  return newMessage;
}

/**
 * Function used to send a response to the patient when he/she contact the clinic
 * outside the office working hours.
 * @param account {{Account}} Account object
 * @param patientPhoneNumber {string} Patient phone number
 * @returns {Promise<*>}
 */
export async function respondOutsideOfOfficeHours(
  {
    id: accountId,
    timezone,
    weeklyScheduleId,
    canAutoRespondOutsideOfficeHours,
    bufferBeforeOpening,
    bufferAfterClosing,
  },
  patientPhoneNumber,
) {
  if (!canAutoRespondOutsideOfficeHours || !patientPhoneNumber) {
    return false;
  }

  const currentMoment = setDateToTimezone(Date.now(), timezone);
  const today = currentMoment.format('dddd').toLowerCase();
  const weeklySchedule = await WeeklySchedule.findByPk(weeklyScheduleId);

  if (!weeklySchedule[today]) return false;

  const after = buildTime(
    weeklySchedule[today],
    currentMoment.toObject(),
    timezone,
    bufferAfterClosing,
  );
  const before = buildTime(
    weeklySchedule[today],
    currentMoment.toObject(),
    timezone,
    bufferBeforeOpening,
  );

  if (
    (currentMoment.isAfter(after.end) || currentMoment.isBefore(after.start)) &&
    (currentMoment.isAfter(before.end) || currentMoment.isBefore(before.start))
  ) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);

    const schedule = await fetchAndComputeFinalDailySchedules({
      accountId,
      startDate: setDateToTimezone(startDate.toISOString(), timezone),
      endDate: setDateToTimezone(endDate.toISOString(), timezone),
    });

    const { startTime } = await getNextStartTime(
      {
        bufferBeforeOpening,
        bufferAfterClosing,
      },
      schedule,
    );

    const nextStartTime = addBuffer(
      startTime,
      {},
      timezone,
      bufferBeforeOpening,
    );
    return `Practice is currently closed, the next opening time is: ${dateToRelativeTime(
      nextStartTime,
    )}.`;
  }
  return false;
}

/**
 * Internal heper function that add buffer to the time
 * @param time {Date}
 * @param currentMoment {Date}
 * @param tz {String}
 * @param buffer {String}
 */
function buildTime(time, currentMoment, tz, buffer) {
  const start = addBuffer(time.startTime, currentMoment, tz, buffer);
  const end = addBuffer(time.endTime, currentMoment, tz, buffer);

  return {
    start,
    end,
  };
}

/**
 * Internal function that add buffer to the time
 * @param {Date} weeklyScheduleToday
 * @param {Date} year, month, date
 * @param {String} tz
 * @param {String} buffer
 */
function addBuffer(
  weeklyScheduleToday,
  { years, months, date } = {},
  tz,
  buffer,
) {
  const dt =
    Object.keys(arguments[1]).length > 0
      ? setDateAndTZ(
        weeklyScheduleToday,
        {
          years,
          months,
          date,
        },
        tz,
      )
      : setDateToTimezone(weeklyScheduleToday, tz);

  if (buffer) {
    return dt.add(...buffer.split(' '));
  }

  return dt;
}

/**
 * Send a sms message to the patient.
 * Creates a new chat if it doesn't exist.
 * Creates a textMessage instance.
 * Update user via socket.
 *
 * @param body {string} Content of the new message.
 * @param patient {{Patient}} Patient object we are sending a message to.
 * @param userId {string} Id of the user that is sending a message.
 * @param chatId {string} Id of the chat we are sending a message for.
 * @returns {Promise}
 */
async function createChatMessage(body, patient, userId, chatId) {
  const account = await Account.findByPk(patient.accountId, { raw: true });

  const sms = {
    body,
    to: patient.cellPhoneNumber,
    from: account.twilioPhoneNumber,
  };
  const smsMessage = await sendSMS(sms);

  if (!chatId) {
    const newChat = {
      accountId: patient.accountId,
      patientId: patient.id,
      patientPhoneNumber: patient.cellPhoneNumber,
    };

    const chatInstance = await Chat.create(newChat);
    chatId = chatInstance.get('id');
  }

  const textMessage = {
    id: smsMessage.id,
    smsStatus: smsMessage.smsStatus,
    body,
    chatId,
    userId,
    to: patient.cellPhoneNumber,
    from: account.twilioPhoneNumber,
    read: true,
  };

  const textMessageInstance = await storeTextMessage(textMessage);
  logger.debug(`Sent message "${textMessageInstance.get('body')}".`);
  await updateUserViaSocket(chatId);
  return textMessageInstance.get({ plain: true });
}

/**
 * Return patient's chat or create a new one.
 * @param accountId {string} Account id we are using for this chat.
 * @param patientPhoneNumber {string} Phone number of the patient.
 * @param patient {Patient} Patient we are getting the chat for.
 * @returns {Promise<{Chat}>}
 */
export async function getOrCreateChatForPatient(
  accountId,
  patientPhoneNumber,
  patient,
) {
  const baseObj = {
    accountId,
    patientId: patient ? patient.id : { $eq: null },
    patientPhoneNumber,
  };

  const chat = await Chat.findOne({ where: baseObj });
  if (!chat) {
    const createChat = await Chat.create({
      ...baseObj,
      patientId: patient && patient.id,
    });

    return createChat.get({ plain: true });
  }

  return chat.get({ plain: true });
}


/**
 * Update chat's last message data.
 *
 * @param chatId {string} Id of chat we are updating.
 * @param messageId {string} Id of message that is now the latest.
 * @param date {string} Date of the latest message.
 * @returns {Promise}
 */
function updateLastMessageData(chatId, messageId, date) {
  return Chat.update(
    {
      lastTextMessageId: messageId,
      lastTextMessageDate: date || new Date(),
    },
    { where: { id: chatId } },
  );
}

/**
 * Send an updated chat instance via socket to end-users.
 * @param chatId
 * @param event
 * @return {Promise}
 */
async function updateUserViaSocket(chatId, event = NEW_MESSAGE) {
  const chat = await getRelevantSocketUpdateData(chatId, event);
  const normalizedChat = normalize('chat', chat.get({ plain: true }));
  publishEvent(chat.accountId, event, normalizedChat);
  return normalizedChat;
}

/**
 * Publishes a new event to the users.
 *
 * @param accountId
 * @param event
 * @param data
 */
function publishEvent(accountId, event, data) {
  const { io } = global;
  io &&
    io
      .of(namespaces.dash)
      .in(accountId)
      .emit(event, data);
}

/**
 * Internal function used to store a textMessage instance and updates the chat's last message data.
 * @param textMessageData {object} text message data that we store in DB.
 * @returns {Promise<void>} Created textMessage model instance.
 */
async function storeTextMessage(textMessageData, markChatAsUnread = false) {
  const textInstance = await TextMessage.create(textMessageData);
  await updateLastMessageData(
    textMessageData.chatId,
    textInstance.get('id'),
    new Date(),
  );

  if (markChatAsUnread) {
    await setChatUnread(textMessageData.chatId);
  }

  return textInstance;
}

/**
 * Internal function used to update a chat instance read/unread status.
 * @param id {object} chat id that we update in DB.
 * @param hasUnread {boolean} Bool value if chat is has unread or not.
 * @returns {Promise<void>}
 */
async function setChatUnread(id, hasUnread = true) {
  const textMessagesCount = await TextMessage.count({
    where: {
      chatId: id,
      read: false,
    },
  });

  return (
    validChatUpdate(hasUnread, textMessagesCount) &&
    Chat.update({ hasUnread }, { where: { id } })
  );
}

/**
 * To be a validate update we need to make sure that,
 * if hasUnread is true we should have textMessagesCount higher than 0
 * or if hasUnread is false we should have textMessagesCount equals to 0.
 * @param hasUnread
 * @param textMessagesCount
 * @returns {boolean}
 */
function validChatUpdate(hasUnread, textMessagesCount) {
  return hasUnread ? textMessagesCount > 0 : textMessagesCount === 0;
}

/**
 * Create a fake patient we use for sending a message to the unknown patients.
 * @param accountId
 * @param cellPhoneNumber
 * @return {{id: null, accountId: string, cellPhoneNumber: string}}
 */
function unknownPatient(accountId, cellPhoneNumber) {
  return {
    id: null,
    accountId,
    cellPhoneNumber,
  };
}
