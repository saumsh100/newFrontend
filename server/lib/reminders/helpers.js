
import moment from 'moment-timezone';
import uniqWith from 'lodash/uniqWith';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';
import forEach from 'lodash/forEach';
import {
  sortAsc,
  convertIntervalStringToObject,
  sortIntervalAscPredicate,
  tzTime,
  setDateToTimezone,
} from '@carecru/isomorphic';
import {
  Account,
  Appointment,
  Patient,
  Family,
  Reminder,
  SentReminder,
  SentRemindersPatients,
} from 'CareCruModels';
import GLOBALS from '../../config/globals';
import { generateOrganizedPatients } from '../comms/util';
import { countConsecutiveClosedDays } from '../schedule/countNextClosedDays';
import reduceSuccessAndErrors from '../contactInfo/reduceSuccessAndErrors';
import flattenFamilyAppointments, { orderAppointmentsForSamePatient } from './flattenFamilyAppointments';
import generateDailyHoursForPractice from '../schedule/generateDailyHoursForPractice';

const CRON_MINUTES = GLOBALS.reminders.cronIntervalMinutes;
const SAME_DAY_HOURS = GLOBALS.reminders.sameDayWindowHours;

/**
 * mapPatientsToReminders will return the patients that need a reminder
 * and organized behind what would succeed and what would fail based on patientData
 *
 * @param reminders
 * @param account
 * @param startDate
 * @param endDate
 * @returns [remindersPatients] = [ { success, error }, { success, error }, ... ]
 */
export async function mapPatientsToReminders({
  reminders,
  account,
  startDate,
  endDate,
}) {
  const seen = {};
  const remindersPatients = [];

  let i;
  for (i = 0; i < reminders.length; i++) {
    const reminder = reminders[i];
    const lastReminder = reminders[i - 1];

    // Get appointments that this reminder deals with
    const appointments = await exports.getAppointmentsFromReminder({
      reminder,
      account,
      startDate,
      endDate,
      lastReminder,
    });

    // If it has been seen by an earlier reminder (farther away from appt.startDate), ignore it!
    // This is why the order or reminders is so important
    let unseenAppts = appointments.filter(a => !seen[a.id]);

    // This is a hacky way to ensure the earliest appointment is getting added
    // to the groups for Family Reminder
    unseenAppts = orderAppointmentsForSamePatient(unseenAppts);

    // Now add it to the seen map
    unseenAppts.forEach(a => (seen[a.id] = true));
    const patients = unseenAppts.map(appt => ({
      ...appt.patient,
      appointment: appt,
    }));

    const channels = reminder.primaryTypes;

    // Weed out the preferences and missing contact info patients
    const firstSuccessAndErrors = generateOrganizedPatients(patients, channels);
    const { success, errors } = await reduceSuccessAndErrors({
      account,
      channels,
      ...firstSuccessAndErrors,
    });

    remindersPatients.push({
      success,
      errors,
    });
  }

  return remindersPatients;
}

/**
 * getAppointmentsFromReminder returns all of the appointments that are
 * - in that clinic
 * - within the reminder timeAway range
 * - and if we should send reminder
 *
 * @param reminder
 * @param account - has a default of empty object for testing simplicity
 * @param startDate
 * @param endDate (defaults to startDate + 5 minutes)
 * @returns [appointments]
 */
export async function getAppointmentsFromReminder({
  reminder,
  account = {},
  startDate,
  endDate,
}) {
  // This function should throw an error if startDate and endDate are not in the same day
  endDate =
    endDate ||
    moment(startDate)
      .add(CRON_MINUTES, 'minutes')
      .toISOString();

  // convert string to { weeks: 1, days: 1, ... }
  const intervalObject = convertIntervalStringToObject(reminder.interval);
  const { timezone } = account;

  // Add the touchpoint's interval to the date we are wanting to check for
  let start = moment(startDate)
    .add(intervalObject)
    .toISOString();

  // If endDate is not supplied, default to using startDate + recall interval
  let end = moment(endDate)
    .add(intervalObject)
    .toISOString();

  // This is where we look to see if the patient has had any appointments
  // within a certain window
  let sameDayStart = moment(start)
    .subtract(SAME_DAY_HOURS, 'hours')
    .toISOString();

  if (reminder.isDaily) {
    // Now adjust end if there are consecutive closed days
    if (reminder.dontSendWhenClosed) {
      const { schedule } = await generateDailyHoursForPractice({
        account,
        startDate,
        endDate: moment(startDate)
          .add(30, 'days')
          .toISOString(),
      });

      const [todayDate] = Object.keys(schedule);
      const todayDailySchedule = schedule[todayDate];
      if (!todayDailySchedule || todayDailySchedule.isClosed) return [];

      // Pop out today's date so we start counting closed days from tomorrow
      delete schedule[todayDate];

      const consecutiveClosedDays = countConsecutiveClosedDays(schedule);
      if (consecutiveClosedDays) {
        console.log(
          'There are consecutive closed days. ' +
          `Bumping endDate by ${consecutiveClosedDays} days.`
        );

        end = moment(end)
          .add(consecutiveClosedDays, 'days')
          .toISOString();
      }
    }

    // Assume that this function is only run when its time to pull these
    // Or else we should check to make sure dailyRunTime is in range
    start = moment
      .tz(start, timezone)
      .startOf('day')
      .toISOString();
    end = moment
      .tz(end, timezone)
      .endOf('day')
      .toISOString();

    // Easier than conditionally querying same-day appts
    // This makes the window 0 seconds
    sameDayStart = start;
  } else if (reminder.startTime) {
    // We would never have a reminder with a specific startTime that was sent isDaily
    // startTime is for rolling reminders like the 2 hour reminders
    const values = reminder.startTime.split(':');
    const startTimeMoment = setDateToTimezone(start, timezone)
      .hours(values[0])
      .minutes(values[1])
      .seconds(values[2])
      .milliseconds(0)
      .add(intervalObject);

    const startTime = reminder.interval.includes('day')
      ? startTimeMoment.subtract(intervalObject).toISOString()
      : startTimeMoment.toISOString();

    if (start <= startTime && startTime < end) {
      // If the reminder.startTime is between the range we are searching then
      // make the lower bound the reminder.startTime
      start = startTime;
    } else if (start <= startTime && end <= startTime) {
      // If range is less than startTime, return zero cause then its not a valid time to send
      return [];
    }
  }

  const defaultAppointmentsScope =
    { ...Appointment.getCommonSearchAppointmentSchema({ isShortCancelled: false }) };

  const familyGroupingEnd = moment(start)
    .add(SAME_DAY_HOURS, 'hours')
    .toISOString();

  // Now we query for the appointments, those appointments patients and sentReminders, and
  // those patients appointments
  let appointments = await Appointment.findAll({
    where: {
      ...defaultAppointmentsScope,
      accountId: reminder.accountId,
      startDate: {
        $gte: start,
        $lt: end,
      },
      chairId: { $notIn: reminder.omitChairIds },
      practitionerId: { $notIn: reminder.omitPractitionerIds },
    },
    // Important for grabbing latest sentReminder and checking if it was within window or
    // lastReminder and this one. If it is, we ignore this touchpoint
    order: [
      ['startDate', 'ASC'],
      [
        {
          model: SentRemindersPatients,
          as: 'sentRemindersPatients',
        },
        'createdAt',
        'desc',
      ],
    ],
    include: [
      {
        model: Patient,
        as: 'patient',
        where: {
          $not: { omitReminderIds: { $contains: [reminder.id] } },
          status: 'Active',
        },
        include: [
          {
            model: Family,
            as: 'family',
            include: [
              {
                model: Patient,
                as: 'patients',
                where: {
                  $not: { omitReminderIds: { $contains: [reminder.id] } },
                  status: 'Active',
                },
                include: [
                  {
                    model: Appointment,
                    as: 'appointments',
                    where: {
                      ...defaultAppointmentsScope,
                      accountId: reminder.accountId,
                      chairId: { $notIn: reminder.omitChairIds },
                      practitionerId: { $notIn: reminder.omitPractitionerIds },
                      startDate: {
                        $gte: start,
                        $lte: familyGroupingEnd, // include the boundary here?
                      },
                    },
                    required: false,
                    include: [
                      {
                        model: SentRemindersPatients,
                        as: 'sentRemindersPatients',
                        required: false,
                        include: [
                          {
                            model: SentReminder,
                            as: 'sentReminder',
                            required: true,
                          },
                        ],
                      },
                    ],
                  },
                ],

                required: false,
              },
            ],

            required: false,
          },
          {
            model: Appointment,
            as: 'appointments',
            where: {
              ...defaultAppointmentsScope,
              accountId: reminder.accountId,
              // Do not include the upper-bound, or else you'll always get the same appointment
              // as above
              startDate: {
                $gte: sameDayStart,
                $lt: start,
              },
            },

            required: false,
          },
        ],

        required: true,
      },
      {
        model: SentRemindersPatients,
        as: 'sentRemindersPatients',
        required: false,
        include: [
          {
            model: SentReminder,
            as: 'sentReminder',
            required: true,
          },
        ],
      },
    ],
  });

  appointments = appointments.map((a) => {
    a = a.get({ plain: true }); // Needed for easier data manipulation
    const { patient: { family } } = a;
    if (family) {
      // Can't use the spread property because it destroys sequelize helpers
      a.patient.family.patients = family.patients.map(p => ({
        // Needs to be a different attribute name so there's backwards compatibility
        ...p,
        appts: p.appointments.map(app => ({
          ...app,
          patient: p,
        })),
        appointments: [],
      }));
    }

    return a;
  });

  appointments = exports.filterReminderAppointments({
    appointments,
    reminder,
  });

  appointments = appointments.reduce(
    (arr, appointment) => [
      ...arr,
      ...flattenFamilyAppointments({
        appointment,
        reminder,
        customApptsAttr: 'appts',
      }),
    ],
    [],
  );

  appointments = uniqBy(appointments, 'id');
  return appointments;
}

/**
 * filterReminderAppointments will group the appointments by the buffer interval and then
 * for each group it will filter out duplicate patients as well as appointments
 * that are confirmed if ignoreSendIfConfirmed=true
 *
 * @param appointments
 * @param reminder
 * @return [filteredAppointments]
 */
export function filterReminderAppointments({ appointments, reminder }) {
  if (!appointments.length) return [];

  // First group appointments by the buffer time (could be every 24 hours, every 6 hours, etc.)
  const floorTime = appointments[0].startDate;
  const groupedAppointmentsByBuffer = groupBy(appointments, a =>
    Math.floor(moment(a.startDate).diff(floorTime, 'hours') / SAME_DAY_HOURS));

  // Now, for each group, ensure the appointments have unique patientIds
  // Then if ignoreSendIfConfirmed if true, filter out the confirmed ones
  let filteredAppointments = [];
  forEach(groupedAppointmentsByBuffer, (appointmentsGroup) => {
    // Grab the earliest appointment for each patient in the group
    let filteredAppointmentsGroup = uniqWith(
      appointmentsGroup,
      (a, b) => a.patient.id === b.patient.id,
    );

    filteredAppointmentsGroup = filteredAppointmentsGroup.filter(a =>
      exports.shouldSendReminder({
        appointment: a,
        reminder,
      }));

    filteredAppointments = [
      ...filteredAppointments,
      ...filteredAppointmentsGroup,
    ];
  });

  return filteredAppointments;
}

/**
 * shouldSendReminder returns a boolean if the appointment is in need
 * of a reminder being sent
 * - checks if reminder was already sent
 * - and if it is sendable according to patient preferences
 *
 * @param appointment
 * @param reminder
 * @param lastReminder
 * @returns {boolean}
 */
export function shouldSendReminder({ appointment, reminder }) {
  const { sentRemindersPatients, patient } = appointment;
  const { preferences, appointments = [] } = patient;

  const sentReminders = sentRemindersPatients.map(exports.extractSentReminders);

  // These are appointments that are within the "same day" window, don't send a reminder
  // This is because a reminder for that appointment was probably already sent
  // NOTE: It should ultimately only ignore if it had a successful sentReminder
  // already not just if it exists
  if (appointments.length) {
    return false;
  }

  if (
    reminder.ignoreSendIfConfirmed &&
    exports.isAppointmentConfirmed(appointment, reminder)
  ) {
    return false;
  }

  // We check if the appointment already have a reminder sent of the same type
  // We don't resend reminders if the appointment got moved to less than 1 day ahead
  const reminderAlreadySentOrLongerAway = sentReminders.some((s) => {
    // For older sentReminders that have lengthSeconds, we can ignore
    if (!s.interval) return false;

    // If it is a different reminder we should always send it
    if (s.reminderId !== reminder.id) return false;

    // If the appointment was not changed since
    // the previous sent reminder, we shouldn't send again
    if (appointment.startDate === s.appointmentStartDate) return true;

    // We add a day and set the time to the start of the day
    // so we are sure we are accounting for the right amount of time
    const sentReminderNextDay = setDateToTimezone(s.appointmentStartDate)
      .add(1, 'day')
      .startOf('day')
      .toISOString();

    // if the reminder was sent the day before or more we send it again
    return appointment.startDate.toISOString() <= sentReminderNextDay;
  });

  return !reminderAlreadySentOrLongerAway && preferences.reminders;
}

/**
 * isAppointmentConfirmed is a function that determines if the appointment is
 * "confirmed". it takes the reminders settings into account
 *
 * @param appointment
 * @param reminder
 * @return {isPreConfirmed|{type}|boolean}
 */
export function isAppointmentConfirmed(appointment, reminder) {
  if (reminder.isCustomConfirm) {
    return appointment.isPreConfirmed || appointment.isPatientConfirmed;
  }
  return appointment.isPatientConfirmed;
}

/**
 * getValidSmsReminders will return the sms reminders that are valid for confirmations
 * so that the text message will confirm it
 *
 * @param patientId
 * @param accountId
 * @param date
 * @return [sentReminders]
 */
export async function getValidSmsReminders({
  accountId,
  patientId,
  date = new Date().toISOString(),
}) {
  // Confirming valid SMS Reminder for patient
  const sentReminders = await SentReminder.findAll({
    where: {
      contactedPatientId: patientId,
      accountId,
      isConfirmed: false,
      isConfirmable: true,
      primaryType: 'sms',
    },
    include: [
      {
        model: Reminder,
        as: 'reminder',
        required: true,
      },
      {
        model: SentRemindersPatients,
        as: 'sentRemindersPatients',
        required: true,
        include: [
          {
            model: Appointment,
            as: 'appointment',
            required: true,
            where: {
              startDate: { $gt: date },
              ...Appointment.getCommonSearchAppointmentSchema(),
            },
          },
          {
            model: Patient,
            as: 'patient',
            attributes: ['firstName'],
          },
        ],
      },
    ],
    order: [['createdAt', 'desc']],
  });

  // here we need to not only filter the appointment but also re order the sentReminders
  // based by appointments date + interval
  // we can't do this in the query due to the format we store in the db
  return sentReminders
    .filter(({ sentRemindersPatients }) => sentRemindersPatients.length > 0)
    .map((sr) => {
      const { appointment: { startDate } } =
        sr.sentRemindersPatients.sort(sortByAppointmentStartDate)[0];

      // we can't destruct sequelize model to not loose it helpers
      sr.orderDate = moment(startDate)
        .add(convertIntervalStringToObject(sr.interval))
        .toISOString();

      return sr;
    })
    .sort(({ orderDate: a }, { orderDate: b }) => sortAsc(a, b));
}

/**
 * Sort sentRemindersPatients by appointment startDate
 *
 * @param appointment.startDate: a
 * @param appointment.startDate: b
 * @returns {sentRemindersPatients}
 */
const sortByAppointmentStartDate = (
  { appointment: { startDate: a } },
  { appointment: { startDate: b } },
) => sortAsc(a, b);

/**
 * fetchActiveReminders is used by the outbox functions to
 * pull active, relevant (based on startDate, endDate) reminders that are ordered
 * by the interval
 *
 * @param account
 * @param startDate
 * @param endDate
 * @return {Promise.<Array.<Model>>}
 */
export async function fetchActiveReminders({ account, startDate, endDate }) {
  const t = d => setDateToTimezone(d, account.timezone).format('HH:mm:ss');
  const start = t(startDate);
  const end = t(endDate);

  // Fetch active reminders for the account that need to be sent
  const reminders = await Reminder.findAll({
    raw: true,
    where: {
      accountId: account.id,
      isDeleted: false,
      isActive: true,
      interval: { $not: null },
      $or: [
        { isDaily: false },
        {
          isDaily: true,
          dailyRunTime: {
            $gte: start,
            $lt: end,
          },
        },
      ],
    },
  });

  // Sort reminders by interval so that we send to earliest first
  return reminders.sort((a, b) =>
    sortIntervalAscPredicate(a.interval, b.interval));
}

/**
 * fetchAccountsAndActiveReminders is used by the reminders job to
 * pull active, relevant (based on startDate, endDate) reminders that are ordered
 * by the interval
 *
 * @param account
 * @param startDate
 * @param endDate
 * @return {Promise.<Array.<Model>>}
 */
export async function fetchAccountsAndActiveReminders({ startDate, endDate }) {
  const accounts = await Account.findAll({
    where: { canSendReminders: true },
    include: [
      {
        model: Reminder,
        as: 'reminders',
        where: {
          isDeleted: false,
          isActive: true,
          interval: { $not: null },
        },
      },
    ],
  });

  // Filter out reminders and sort by interval
  accounts.forEach((account) => {
    account.reminders = account.reminders
      .filter(generateIsActiveReminder({
        account,
        startDate,
        endDate,
      }))
      .sort((a, b) => sortIntervalAscPredicate(a.interval, b.interval));
  });

  return accounts;
}

/**
 * generateIsActiveReminder is a thunk that will return a predicate to filter
 * out isDaily reminders in an array whose dailyRunTime is not in the range
 *
 * @param account
 * @param startDate
 * @param endDate
 */
export function generateIsActiveReminder({ account, startDate, endDate }) {
  return (reminder) => {
    if (!reminder.isDaily) return true;

    // If it's a daily reminder, ensure the dailyRunTime is within the range
    // or else it wouldn't get sent in the range and no need to return
    const { dailyRunTime } = reminder;
    const { timezone } = account;
    const start = tzTime(startDate, timezone);
    const end = tzTime(endDate, timezone);
    return start <= dailyRunTime && dailyRunTime < end;
  };
}

/**
 * Confirm reminder if exist.
 *
 * @param accountId
 * @param patientId
 * @returns {Promise<*>}
 */
export async function confirmReminderIfExist(accountId, patientId, date) {
  const validSmsReminders = await exports.getValidSmsReminders({
    patientId,
    accountId,
    date,
  });

  // Early return if no reminders found
  if (validSmsReminders.length === 0) {
    return [];
  }

  // Confirm first available reminder
  const sentReminder = validSmsReminders[0];
  await SentReminder.update(
    { isConfirmed: true },
    { where: { id: sentReminder.get('id') } },
  );

  // Confirm all appointments for that reminder
  await Promise.all(sentReminder.sentRemindersPatients.map(({ appointment }) =>
    appointment.confirm(sentReminder.reminder.get({ plain: true }))));

  return validSmsReminders;
}

/**
 * Extract the sentReminder object out of sentRemindersPatients to keep compatibility with old APIs
 *
 * @param sentRemindersPatients
 * @returns {Object}
 */
export function extractSentReminders(sentRemindersPatients) {
  const { sentReminder, ...rest } = sentRemindersPatients;
  return {
    ...sentReminder,
    ...rest,
  };
}
