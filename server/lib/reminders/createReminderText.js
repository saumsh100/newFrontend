import moment from 'moment-timezone';
import { convertIntervalStringToObject } from '../../util/time';
import { formatPhoneNumber } from '../../util/formatters';

const nowISO = () => new Date().toISOString();

const getDateAndTime = (date, timezone) => {
  const mDate = moment.tz(date, timezone);
  return {
    date: mDate.format('MMMM Do'),
    time: mDate.format('h:mma'),
  };
};

const weeksAway = {
  unconfirmed: ({
    patient, account, appointment, action,
  }) => {
    const { date, time } = getDateAndTime(appointment.startDate, account.timezone);
    return (
      `Hi ${patient.firstName}, your next appointment ` +
      `with ${account.name} is on ${date} at ${time}. ` +
      `Reply "C" to ${action} your appointment.`
    );
  },

  confirmed: ({ patient, account, appointment }) => {
    const { date, time } = getDateAndTime(appointment.startDate, account.timezone);
    return (
      `Hi ${patient.firstName}, this is just a friendly reminder ` +
      `that your next appointment with ${account.name} ` +
      `is on ${date} at ${time}.`
    );
  },
};

const weekAway = {
  unconfirmed: ({
    patient, account, appointment, action,
  }) => {
    const { date, time } = getDateAndTime(appointment.startDate, account.timezone);
    return (
      `Hi ${patient.firstName}, your upcoming appointment at ${account.name} is on ` +
      `${date} at ${time}. Respond with the letter "C" to ${action}.`
    );
  },

  confirmed: ({ patient, account, appointment }) => {
    const { date, time } = getDateAndTime(appointment.startDate, account.timezone);
    return (
      `Hi ${patient.firstName}, your upcoming appointment at ${account.name} is on ` +
      `${date} at ${time}.`
    );
  },
};

const sameWeek = {
  unconfirmed: ({
    patient, account, appointment, action,
  }) => {
    const { date, time } = getDateAndTime(appointment.startDate, account.timezone);
    return (
      `Hi ${patient.firstName}, your upcoming appointment at ` +
      `${account.name} is on ${date} at ${time}. ` +
      `To ${action}, please reply with the letter "C".`
    );
  },

  confirmed: ({ patient, account, appointment }) => {
    const { date, time } = getDateAndTime(appointment.startDate, account.timezone);
    return (
      `Hi ${patient.firstName}, your upcoming appointment at ` +
      `${account.name} is on ${date} at ${time}.`
    );
  },
};

const sameDay = {
  unconfirmed: ({
    patient, account, appointment, action,
  }) => {
    const { time } = getDateAndTime(appointment.startDate, account.timezone);
    return (
      `Hi ${patient.firstName}, please ${action} today's ${time} ` +
      `appointment at ${account.name}. ` +
      `Reply with "C" to ${action} or call us at ${formatPhoneNumber(account.destinationPhoneNumber)} to reschedule.`
    );
  },

  confirmed: ({ patient, account, appointment }) => {
    const { time } = getDateAndTime(appointment.startDate, account.timezone);
    return (
      `Hi ${patient.firstName}! We'll see you at ${time} today ` +
      `for your appointment at ${account.name}.`
    );
  },
};

const createText = {
  weeksAway,
  weekAway,
  sameWeek,
  sameDay,
};

export default function createReminderText({
  patient,
  account,
  appointment,
  reminder = {},
  currentDate = nowISO(),
}) {
  const type = getReminderType({
    account,
    appointment,
    reminder,
    currentDate,
  });
  const subtype = appointment.isPatientConfirmed ? 'confirmed' : 'unconfirmed';
  const action = reminder.isCustomConfirm ? 'pre-confirm' : 'confirm';
  return createText[type][subtype]({
    patient,
    account,
    appointment,
    action,
  });
}

export function getReminderType({
  account: { timezone },
  appointment,
  reminder,
  currentDate = nowISO(),
}) {
  if (!appointment && !reminder) {
    throw new Error('Must pass in at least an appointment or a reminder to determine type');
  }

  // If appointment is not defined,
  // assume reminder is there and get apptDate from there to determine type
  const apptDate =
    appointment && appointment.startDate
      ? moment(appointment.startDate)
      : moment().add(convertIntervalStringToObject(reminder.interval));

  // Now see how many days away it is, and categorize it
  const isSameDay = moment.tz(apptDate, timezone).isSame(currentDate, 'day');

  if (isSameDay) {
    return 'sameDay';
  }

  const daysDiff = apptDate.diff(currentDate, 'days');
  if (daysDiff < 5) {
    return 'sameWeek';
  } else if (daysDiff < 8) {
    return 'weekAway';
  }

  return 'weeksAway';
}

export function getReminderTemplateName({ isConfirmable, reminder, account }) {
  const typeMap = {
    weeksAway: 'Weeks Away',
    weekAway: 'Week Away',
    sameWeek: 'Same Week',
    sameDay: 'Same Day',
  };

  const type = getReminderType({ reminder, account });
  const isCustomConfirm = reminder.isCustomConfirm ? 'Preconfirmed' : 'Unconfirmed';
  const confirmType = isConfirmable === 'true' ? isCustomConfirm : 'Confirmed';

  return `Patient Reminder - ${typeMap[type]} - ${confirmType}`;
}
