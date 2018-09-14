
import { Op } from 'sequelize';
import {
  Account,
  Appointment,
  Chat,
  Patient,
  SentReminder,
  TextMessage,
  User,
} from 'CareCruModels';
import { namespaces } from '../../config/globals';
import { setDateToTimezone } from '../../util/time';
import { sendSMS } from '../sms';
import logger from '../../config/logger';
import { isSmsConfirmationResponse } from '../../lib/comms/util/responseChecks';
import { confirmReminderIfExist } from '../../lib/reminders/helpers';
import { createConfirmationText } from '../../lib/reminders/sendReminder';
import normalize from '../../routes/_api/normalize';
import { getPatientFromCellPhoneNumber } from '../../lib/contactInfo/getPatientFromCellPhoneNumber';

/**
 * Socket events.
 */
const NEW_MESSAGE = 'create:TextMessage';
const MARK_UNREAD = 'unread:TextMessage';
const MARK_READ = 'read:TextMessage';
const UPDATE_CHAT = 'update:Chat';

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
  const {
    from,
    body,
  } = textMessageData;

  // Grab account from incoming number so that we can get accountId
  const patient = await getPatientFromCellPhoneNumber({
    accountId: account.id,
    cellPhoneNumber: from,
  });

  const chatClean = await getOrCreateChatForPatient(account.id, from, patient);
  logger.debug(`Chat ${chatClean.id} found or created.`);
  const textMessage = await storeTextMessage({
    ...textMessageData,
    ...{ chatId: chatClean.id },
  });

  logger.debug(`TextMessage ${textMessage.get('id')} stored.`);
  if (!patient || !isSmsConfirmationResponse(body)) {
    logger.debug(`Not a ${!patient ? 'patient' : 'sms confirmation'}, exiting.`);
    await updateUserViaSocket(chatClean.id);
    return;
  }

  // Confirm first available reminder
  const sentReminders = await confirmReminderIfExist(account.id, patient.id);
  const firstSentReminder = sentReminders[0];
  if (!firstSentReminder || firstSentReminder.sentRemindersPatients.length === 0) {
    logger.debug('No reminders to confirm, exiting.');
    await updateUserViaSocket(chatClean.id);
    return;
  }

  const { reminder, sentRemindersPatients } = firstSentReminder;
  const pocPatient = sentRemindersPatients
    .find(({ appointment: a }) => a.patientId === firstSentReminder.contactedPatientId);

  logger.debug(`Reminder ${firstSentReminder.id} confirmed.`);
  const sentReminderClean = firstSentReminder.get({ plain: true });
  const normalizedReminder = normalize('sentReminder', sentReminderClean);
  publishEvent(account.id, 'create:SentReminder', normalizedReminder);
  await markMessageAsRead(textMessage.get('id'));
  const messageBody = createConfirmationText({
    patient,
    appointment: pocPatient ? pocPatient.appointment : {},
    account,
    reminder,
    isFamily: sentReminderClean.isFamily,
    sentRemindersPatients,
  });

  const confirmationTextMessage =
    await createChatMessage(messageBody, patient, null, chatClean.id);
  logger.debug(`Sent ${confirmationTextMessage.id} confirmation message.`);
  await updateUserViaSocket(chatClean.id);
}

/**
 * Sends a message to the user.
 * A function that encapsulates createTextMessage and requires less parameters for easier use
 * generally.
 *
 * @param mobilePhoneNumber {string} Patient's phone number we are sending a message to.
 * @param message {string} Message content.
 * @param user {string|null} An id of user that is sending a message.
 * @returns {Promise}
 */
export async function sendMessage(mobilePhoneNumber, message, accountId, user = null) {
  const patient = await getPatientFromCellPhoneNumber({
    accountId,
    cellPhoneNumber: mobilePhoneNumber,
  });

  const chat = await Chat.findOne({
    raw: true,
    where: { patientId: patient.id },
  });

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
export async function markMessagesAsUnread(chatId, textMessageCreatedAt, phoneNumber) {
  await TextMessage.update(
    { read: false },
    {
      where: {
        chatId,
        to: phoneNumber,
        createdAt: { [Op.gte]: setDateToTimezone(textMessageCreatedAt, 'America/Vancouver').toDate() },
      },
    },
  );

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
    TextMessage.findById(messageId),
    Patient.findById(patientId, { raw: true }),
  ]);
  const newMessage = createChatMessage(oldMessage.get('body'), patient, oldMessage.get('userId'), oldMessage.get('chatId'));
  await oldMessage.destroy();
  return newMessage;
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
  const account = await Account.findById(patient.accountId, { raw: true });

  const sms = {
    body,
    to: patient.mobilePhoneNumber,
    from: account.twilioPhoneNumber,
  };
  const smsMessage = await sendSMS(sms);

  if (!chatId) {
    const newChat = {
      accountId: patient.accountId,
      patientId: patient.id,
      patientPhoneNumber: patient.mobilePhoneNumber,
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
    to: patient.mobilePhoneNumber,
    from: account.twilioPhoneNumber,
    read: true,
  };

  const textMessageInstance = await storeTextMessage(textMessage);

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
async function getOrCreateChatForPatient(accountId, patientPhoneNumber, patient) {
  let chat = null;
  if (patient) {
    chat = await Chat.findOne({
      where: {
        accountId,
        patientId: patient.id,
      },
    });
  } else {
    chat = await Chat.findOne({
      where: {
        accountId,
        patientPhoneNumber,
        patientId: { $eq: null },
      },
    });
  }

  if (!chat) {
    chat = await Chat.create({
      accountId,
      patientId: patient && patient.id,
      patientPhoneNumber,
    });
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
  return Chat.update({
    lastTextMessageId: messageId,
    lastTextMessageDate: date || new Date(),
  }, { where: { id: chatId } });
}

/**
 * Send an updated chat instance via socket to end-users.
 * @param chatId
 * @param event
 * @return {Promise}
 */
async function updateUserViaSocket(chatId, event = NEW_MESSAGE) {
  const chat = await getChatForSocketUpdate(chatId);
  const normalizedChat = normalize('chat', chat.get({ plain: true }));
  publishEvent(chat.accountId, event, normalizedChat);
  return normalizedChat;
}

/**
 * Get a chat with all the required relations that we use for socket update.
 * @param id The ID of chat.
 * @returns {Promise}
 */
function getChatForSocketUpdate(id) {
  return Chat.findOne({
    where: { id },
    include: [
      {
        model: TextMessage,
        as: 'textMessages',
        required: false,
        order: ['createdAt', 'ASC'],
        include: {
          model: User,
          as: 'user',
          attributes: { exclude: 'password' },
          required: false,
        },
      },
      {
        model: Patient,
        as: 'patient',
        required: false,
      },
    ],
    order: [
      [['lastTextMessageDate', 'DESC']],
      [{
        model: TextMessage,
        as: 'textMessages',
      }, 'createdAt', 'ASC'],
    ],
  });
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
  io && io
    .of(namespaces.dash)
    .in(accountId)
    .emit(event, data);
}

/**
 * Internal function used to store a textMessage instance and updates the chat's last message data.
 * @param textMessageData {object} text message data that we store in DB.
 * @returns {Promise<void>} Created textMessage model instance.
 */
async function storeTextMessage(textMessageData) {
  const textInstance = await TextMessage.create(textMessageData);
  await updateLastMessageData(textMessageData.chatId, textInstance.get('id'), new Date());
  return textInstance;
}
