
import moment from 'moment-timezone';
import omit from 'lodash/omit';
import { env } from '../../config/globals';
import {
  Account,
  Appointment,
  Chat,
  Patient,
  Reminder,
  SentReminder,
  TextMessage,
} from '../../_models';
import GLOBALS from '../../config/globals';
import { organizeForOutbox } from '../comms/util';
import normalize from '../../routes/_api/normalize';
import { sanitizeTwilioSmsData } from '../../routes/_twilio/util';
import { generateOrganizedPatients } from '../comms/util';
import {
  convertIntervalStringToObject,
  sortIntervalAscPredicate,
  ceilDateMinutes,
  floorDateMinutes,
} from '../../util/time';
import {
  mapPatientsToReminders,
  fetchActiveReminders,
  fetchAccountsAndActiveReminders,
} from './helpers';
import sendReminder, { getIsConfirmable } from './sendReminder';

async function sendSocket(io, chatId) {
  let chat = await Chat.findOne({
    where: { id: chatId },
    include: [
      {
        model: TextMessage,
        as: 'textMessages',
        order: ['createdAt', 'DESC'],
      },
      {
        model: Patient,
        as: 'patient',
      },
    ],
  });

  chat = chat.get({ plain: true });

  await io.of('/dash')
    .in(chat.patient.accountId)
    .emit('newMessage', normalize('chat', chat));
}

/**
 * sendRemindersForAccount is an async function that will send reminders for the account passed in
 * by calling other composable functions to assemble patients that need reminders and then looping through
 * them and sending the appropriate comms to them
 *
 * - call mapPatientsToReminders to grab the patients that need a respective reminder
 * - loop through this sortedReminders
 *    - grab errored patients from the map and do a batchSave of failed sentReminders
 *    - loop through successful patients and try sending reminders to them
 *      - if error, do nothing as sentReminder is not successful by default in DB
 *      - if no error, update sentReminder to be a successful one
 *
 * @param account
 * @param date
 * @param pub
 * @returns {undefined}
 */
export async function sendRemindersForAccount({ account, startDate, endDate, pub }) {
  const { reminders, name } = account;
  console.log(`Sending reminders for ${name} (${account.id}) at ${moment(startDate).format('YYYY-MM-DD h:mma')}...`);

  // Sort reminders by interval so that we send to earliest first
  const sortedReminders = reminders.sort((a, b) => sortIntervalAscPredicate(a.interval, b.interval));

  // Collect successfully sent sentReminderIds to be sent to create correspondences
  const sentReminderIds = [];
  const remindersPatients = await mapPatientsToReminders({ reminders: sortedReminders, account, startDate, endDate });

  let i;
  for (i = 0; i < sortedReminders.length; i++) {
    const reminder = sortedReminders[i];
    const { errors, success } = remindersPatients[i];
    const { primaryTypes, interval } = reminder;

    // For logging purposes
    const reminderName = `'${interval} ${primaryTypes.join(' & ')}'`;

    console.log(`-- Sending ${reminderName} reminder...`);
    console.log(`---- ${errors.length} => sentReminders that would fail`);

    if (errors.length) {
      try {
        // Save failed sentRecalls from errors
        const failedSentReminders = errors.map(({ errorCode, patient, primaryType }) => ({
          reminderId: reminder.id,
          accountId: account.id,
          patientId: patient.id,
          appointmentId: patient.appointment.id,
          isConfirmable: getIsConfirmable(patient.appointment, reminder),
          interval: reminder.interval,
          primaryType,
          errorCode,
        }));

        await SentReminder.bulkCreate(failedSentReminders);
        console.log(`------ ${errors.length} => saved sentReminders that would fail`);
      } catch (err) {
        console.error(`------ Failed bulk saving of sentReminders that would fail`);
        console.error(err);
      }
    }

    console.log(`---- ${success.length} => reminders that should succeed`);
    for (const { patient, primaryType } of success) {
      const { appointment } = patient;
      // const { primaryType } = reminder;

      // Save sent reminder first so we can
      // - use sentReminderId as token in email
      // - keep track of failed reminders
      const sentReminder = await SentReminder.create({
        reminderId: reminder.id,
        accountId: account.id,
        patientId: patient.id,
        appointmentId: appointment.id,
        interval: reminder.interval,
        isConfirmable: getIsConfirmable(appointment, reminder),
        primaryType,
      });

      let data = null;
      try {
        data = await sendReminder[primaryType]({
          patient,
          account,
          appointment,
          sentReminder,
          reminder,
          currentDate: startDate,
        });

        sentReminderIds.push(sentReminder.id);

        console.log(`------ Sent '${interval} ${primaryType}' reminder to ${patient.firstName} ${patient.lastName}`);
      } catch (error) {
        console.error(`------ Failed sending '${interval} ${primaryType}' reminder to ${patient.firstName} ${patient.lastName}`);
        console.error(error);
        continue;
      }

      await sentReminder.update({ isSent: true });
      const appt = await Appointment.findById(appointment.id);
      appt.update({ isReminderSent: true });

      // This needs to be refactored into a Chat lib module
      if (primaryType === 'sms' && env !== 'test') {
        const textMessageData = sanitizeTwilioSmsData(data);
        const { to } = textMessageData;
        let chat = await Chat.findOne({ where: { accountId: account.id, patientPhoneNumber: to } });
        if (!chat) {
          chat = await Chat.create({
            accountId: account.id,
            patientId: patient.id,
            patientPhoneNumber: to,
          });
        }

        // Now save TM
        const textMessage = await TextMessage.create(Object.assign({}, textMessageData, { chatId: chat.id, read: true }));

        // Update Chat to have new textMessage
        await chat.update({ lastTextMessageId: textMessage.id, lastTextMessageDate: textMessage.createdAt });

        // Now update the clients in real-time
        global.io && await sendSocket(global.io, chat.id);
      }
    }
  }

  pub && pub.publish('REMINDER:SENT:BATCH', JSON.stringify(sentReminderIds));
  console.log(`Reminders completed for ${account.name} (${account.id})!`);
}

/**
 * computeRemindersAndSend is an async function that will act like the top-level do-er of
 * sending reminder comms to accounts. It's called by the cron job but can also
 * be used to manually trigger the sending of reminders for accounts (ie. in testing)
 *
 * - fetch accounts that can send auto-reminders, include that account's active reminders
 * - loop through these fetched accounts
 *   - send auto-reminders for account
 *
 * @param  {startDate} date in which the job is run (created by cron job but can be overriden for testing)
 * @param  {endDate} date that closes the range you are searching for
 * @param  {pub} RabbitMQ client module, for publishing events on reminders being sent
 * @returns {undefined}
 */
export async function computeRemindersAndSend({ startDate, endDate, pub }) {
  // Get all clinics that actually want reminders sent and get their Reminder Touchpoints
  const accounts = await fetchAccountsAndActiveReminders({ startDate, endDate });
  for (const account of accounts) {
    // use `exports.` because we can mock it and stub it in test suite
    await exports.sendRemindersForAccount({ account, startDate, endDate, pub });
  }
}

/**
 * getRemindersOutboxList is an async function that will return the list of patients that will receive
 * reminders communications within a certain period of time (between { startDate, endDate })
 *
 * - startDate is ciel to nearest 5 minute
 * - endDate is floor to nearest 5 minute
 * - grab reminders for account and sort them
 * - call mapPatientsToReminders to get [{ success, error }, { success, error }, ...]
 * - loop over that array
 *    - take "success" sentReminders and orderBy appointmentDate
 *    - loop through the success now and add sendDate
 *    - order array by sendDate
 *    - spread into returned array
 *  - order returned array by sendDate
 *
 * @param account
 * @param startDate
 * @param endDate
 * @returns [outboxList] = [{ ...patientData, ...reminderDate, sendDate }, ...]
 */
export async function getRemindersOutboxList({ account, startDate, endDate }) {
  // Fetch active reminders for the account that need to be sent
  const reminders = await fetchActiveReminders({ account, startDate, endDate });

  // Adjust dates so we are not including items that would not happen in the interval.
  // This is because we need to show according to how we run the cron
  startDate = ceilDateMinutes(startDate, GLOBALS.reminders.cronIntervalMinutes);
  endDate = floorDateMinutes(endDate, GLOBALS.reminders.cronIntervalMinutes);

  const remindersPatients = await mapPatientsToReminders({
    account,
    startDate,
    endDate,
    reminders,
  });

  // Now we begin to produce the final array
  let outboxList = [];
  remindersPatients.forEach(({ success }, i) => {
    const reminder = reminders[i];

    // mapPatientsToReminders will return a flatter array with primaryTypes separated into primaryType
    // this will group it back together
    const organizedList = organizeRemindersOutboxList(success);

    // Clone array so its not mutable and order by appointment.startDate ASC
    // TODO: do we really need to slice() and make immutable here? whats the performance loss?
    const sortedPatientsAppointments = organizedList.slice()
      .sort((a, b) => a.patient.appointment.startDate > b.patient.appointment.startDate);

    // map over the sorted array and construct the final object:
    // { patient: { ...patientData, appointment }, reminder, sendDate }
    const outboxReminders = sortedPatientsAppointments.map((pa) => {
      const intervalObject = convertIntervalStringToObject(reminder.interval);
      const subtractedDate = moment(pa.patient.appointment.startDate).subtract(intervalObject).toISOString();
      let sendDate = floorDateMinutes(subtractedDate, GLOBALS.reminders.cronIntervalMinutes);
      if (reminder.isDaily) {
        sendDate = moment.tz(
          `${moment(subtractedDate).format('YYYY-MM-DD')} ${reminder.dailyRunTime}`,
          account.timezone
        ).toISOString();
      }

      return {
        ...pa,
        reminder,
        sendDate,
      };
    });

    outboxList = [...outboxList, ...outboxReminders];
  });

  return outboxList.sort((a, b) => a.sendDate > b.sendDate);
}

/**
 * organizeRemindersOutboxList is a function used to organize the outbox for reminders ontop of
 * mapPatientsToReminders
 *
 * @params outboxList
 */
export function organizeRemindersOutboxList(outboxList) {
  // Assume appointment.id is the unique indicator
  // (shouldn't be multiple different reminders going out to same appointment)
  const selectorPredicate = ({ patient: { appointment } }) => appointment.id;
  const mergePredicate = (groupedArray) => {
    const primaryTypes = groupedArray.map(item => item.primaryType);
    const newObj = {
      ...groupedArray[0],
      primaryTypes,
    };

    return omit(newObj, 'primaryType');
  };

  return organizeForOutbox(outboxList, selectorPredicate, mergePredicate);
}
