
import moment from 'moment-timezone';
import omit from 'lodash/omit';
import {
  sortAsc,
  convertIntervalStringToObject,
  sortIntervalAscPredicate,
  ceilDateMinutes,
  floorDateMinutes,
} from '@carecru/isomorphic';
import {
  Appointment,
  SentReminder,
  SentRemindersPatients,
} from 'CareCruModels';
import GLOBALS from '../../config/globals';
import { organizeForOutbox } from '../comms/util';
import {
  mapPatientsToReminders,
  fetchActiveReminders,
  fetchAccountsAndActiveReminders,
} from './helpers';
import sendReminder, { getIsConfirmable } from './sendReminder';
import { cleanRemindersSuccessData } from './outbox';

/**
 * sendRemindersForAccount is an async function that will send reminders for the account passed in
 * by calling other composable functions to assemble patients that need reminders and
 * then looping through them and sending the appropriate comms to them
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
export async function sendRemindersForAccount({
  account,
  startDate,
  endDate,
  pub,
}) {
  const { reminders, name } = account;
  console.log(`Sending reminders for ${name} (${account.id}) at ${moment(startDate).format('YYYY-MM-DD h:mma')}...`);

  // Sort reminders by interval so that we send to earliest first
  const sortedReminders = reminders.sort((a, b) =>
    sortIntervalAscPredicate(a.interval, b.interval));

  // Collect successfully sent sentReminderIds to be sent to create correspondences
  const sentReminderIds = [];
  const remindersPatients = await mapPatientsToReminders({
    reminders: sortedReminders,
    account,
    startDate,
    endDate,
  });

  let i;
  for (i = 0; i < sortedReminders.length; i += 1) {
    const reminder = sortedReminders[i];
    const { errors, success } = remindersPatients[i];
    const { primaryTypes, interval } = reminder;

    // For logging purposes
    const reminderName = `'${interval} ${primaryTypes.join(' & ')}'`;

    console.log(`-- Sending ${reminderName} reminder...`);
    console.log(`---- ${errors.length} => sentReminders that would fail`);

    if (errors.length) {
      try {
        // eslint-disable-next-line no-restricted-syntax
        for (const { errorCode, patient, primaryType } of errors) {
          // Save failed sentRecalls from errors
          const sentReminder = await SentReminder.create({
            reminderId: reminder.id,
            accountId: account.id,
            contactedPatientId: patient.id,
            isConfirmable: getIsConfirmable(patient.appointment, reminder),
            interval: reminder.interval,
            primaryType,
            errorCode,
          });

          await SentRemindersPatients.create({
            sentRemindersId: sentReminder.id,
            patientId: patient.id,
            appointmentId: patient.appointment.id,
            appointmentStartDate: patient.appointment.startDate,
          });
        }
        console.log(`------ ${errors.length} => saved sentReminders that would fail`);
      } catch (err) {
        console.error('------ Failed bulk saving of sentReminders that would fail');
        console.error(err);
      }
    }

    console.log(`---- ${success.length} => reminders that should succeed`);

    // eslint-disable-next-line no-restricted-syntax
    for (const { patient, dependants, primaryType } of success) {
      const { appointment } = patient;
      const allPatients = [patient, ...dependants];
      const patientsWithAppointments = allPatients.filter(p => p.appointment);
      // Save sent reminder first so we can
      // - use sentReminderId as token in email
      // - keep track of failed reminders
      const sentReminder = await SentReminder.create({
        reminderId: reminder.id,
        accountId: account.id,
        contactedPatientId: patient.id,
        interval: reminder.interval,
        isConfirmable: patientsWithAppointments.some(({ appointment: a }) =>
          getIsConfirmable(a, reminder)),
        primaryType,
        isFamily: dependants.length > 0,
      });

      await Promise.all(patientsWithAppointments.map(({ id, appointment }) =>
        SentRemindersPatients.create({
          sentRemindersId: sentReminder.id,
          patientId: id,
          appointmentId: appointment.id,
          appointmentStartDate: appointment.startDate,
        })));

      try {
        await sendReminder[primaryType]({
          patient,
          account,
          appointment,
          dependants,
          sentReminder,
          reminder,
          currentDate: startDate,
        });

        sentReminderIds.push(sentReminder.id);

        console.log(`------ Sent '${interval} ${primaryType}' reminder to ${
          patient.firstName
        } ${patient.lastName}`);
      } catch (error) {
        console.error(`------ Failed sending '${interval} ${primaryType}' reminder to ${
          patient.firstName
        } ${patient.lastName}`);
        console.error(error);
        continue;
      }

      await sentReminder.update({ isSent: true });
      await Promise.all(patientsWithAppointments.map(({ appointment: a }) =>
        Appointment.update({ isReminderSent: true }, { where: { id: a.id } })));
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
  const accounts = await fetchAccountsAndActiveReminders({
    startDate,
    endDate,
  });
  for (const account of accounts) {
    // use `exports.` because we can mock it and stub it in test suite
    await exports.sendRemindersForAccount({
      account,
      startDate,
      endDate,
      pub,
    });
  }
}

/**
 * getRemindersOutboxList is an async function that will return the list of
 * patients that will receive reminders communications within a certain period
 * of time (between { startDate, endDate })
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
  const reminders = await fetchActiveReminders({
    account,
    startDate,
    endDate,
  });

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

    // mapPatientsToReminders will return a flatter array with primaryTypes
    // separated into primaryType
    // this will group it back together
    const organizedList = organizeRemindersOutboxList(success);

    // Clone array so its not mutable and
    // order by appointment.startDate ASC of the earlies appointment of the reminder
    const sortedPatientsAppointments = organizedList
      .slice()
      .sort(sortRemindersByEarliestAppointmentDate);

    // map over the sorted array and construct the final object:
    // { patient: { ...patientData, appointment }, reminder, sendDate }
    const outboxReminders = sortedPatientsAppointments.map((pa) => {
      const intervalObject = convertIntervalStringToObject(reminder.interval);
      const subtractedDate = moment(getEarliestApptDateFromReminder(pa))
        .subtract(intervalObject)
        .toISOString();
      const sendDate = reminder.isDaily
        ? moment
          .tz(
            `${moment(subtractedDate).format('YYYY-MM-DD')} ${
              reminder.dailyRunTime
            }`,
            account.timezone,
          )
          .toISOString()
        : floorDateMinutes(
          subtractedDate,
          GLOBALS.reminders.cronIntervalMinutes,
        );

      return {
        ...pa,
        reminder,
        sendDate,
      };
    });

    outboxList = [...outboxList, ...outboxReminders];
  });

  return outboxList
    .map(a => cleanRemindersSuccessData(a))
    .sort((a, b) => a.sendDate > b.sendDate);
}

/**
 * Join appointment from PoC and dependants and return the earliest
 * appointment date among them
 *
 * @param {*} reminder.patient
 * @param {*} reminder.dependants
 * @return {string} earliest appointment date of the reminder
 */
const getEarliestApptDateFromReminder = ({ patient, dependants }) =>
  [patient, ...dependants]
    .filter(({ appointment }) => appointment)
    .sort(({ appointment: { startDate: a } }, { appointment: { startDate: b } }) =>
      sortAsc(a, b))[0].appointment.startDate;

/**
 * Sort reminders by each one earliest appointment date
 */
const sortRemindersByEarliestAppointmentDate = (a, b) =>
  sortAsc(
    getEarliestApptDateFromReminder(a),
    getEarliestApptDateFromReminder(b),
  );

/**
 * organizeRemindersOutboxList is a function used to organize the outbox for reminders ontop of
 * mapPatientsToReminders
 *
 * @params outboxList
 */
export function organizeRemindersOutboxList(outboxList) {
  // Prefix the grouping with the PoC patientId to guarantee that
  // the correct patient is displayed as contact
  // Assume appointment.id is the unique indicator
  // (shouldn't be multiple different reminders going out to same appointment)
  const selectorPredicate = ({ patient, dependants }) => {
    const appt = [patient, ...dependants]
      .filter(({ appointment }) => appointment)
      .map(({ appointment }) => appointment.id)
      .join('-');

    return `${patient.id}-${appt}`;
  };

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
