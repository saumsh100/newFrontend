
import moment from 'moment-timezone';
import { convertIntervalStringToObject } from '../../util/time';

const nowISO = () => (new Date()).toISOString();

const getDateAndTime = (date) => {
  const mDate = moment(date);
  return {
    date: mDate.format('MMMM Do'),
    time: mDate.format('h:mma'),
  };
};

const weeksAway = {
  unconfirmed: ({ patient, account, appointment }) => {
    const { date, time } = getDateAndTime(appointment.startDate);
    return `Hi ${patient.firstName}, your next appointment ` +
      `with ${account.name} is on ${date} at ${time}. ` +
      `Reply "C" to confirm your appointment.`;
  },

  confirmed: ({ patient, account, appointment }) => {
    const { date, time } = getDateAndTime(appointment.startDate);
    return `Hi ${patient.firstName}, this is just a friendly reminder ` +
      `that your next appointment with ${account.name} ` +
      `is on ${date} at ${time}.`;
  },
};

const weekAway = {
  unconfirmed: ({ patient, account, appointment }) => {
    const { date, time } = getDateAndTime(appointment.startDate);
    return `Hi ${patient.firstName}, your upcoming appointment is at ` +
      `${time} on ${date}. Respond with the letter "C" to confirm.`;
  },

  confirmed: ({ patient, account, appointment }) => {
    const { date, time } = getDateAndTime(appointment.startDate);
    return `Hi ${patient.firstName}, your upcoming appointment is at ` +
      `${time} on ${date}.`;
  },
};

const sameWeek = {
  unconfirmed: ({ patient, account, appointment }) => {
    const { date, time } = getDateAndTime(appointment.startDate);
    return `Hi ${patient.firstName}, this week's appointment at ` +
      `${account.name} is on ${date} at ${time}. ` +
      `To confirm, please reply with the letter "C".`;
  },

  confirmed: ({ patient, account, appointment }) => {
    const { date, time } = getDateAndTime(appointment.startDate);
    return `Hi ${patient.firstName}, this week's appointment at ` +
      `${account.name} is on ${date} at ${time}.`;
  },
};

const sameDay = {
  unconfirmed: ({ patient, account, appointment }) => {
    const { date, time } = getDateAndTime(appointment.startDate);
    return `Hi ${patient.firstName}, please confirm today's ${time} ` +
      `appointment at ${account.name}. ` +
      `Reply with "C" to confirm or call us at ${account.destinationPhoneNumber} to reschedule.`;
  },

  confirmed: ({ patient, account, appointment }) => {
    const { date, time } = getDateAndTime(appointment.startDate);
    return `Hi ${patient.firstName}! We'll see you at ${time} today ` +
      `for your appointment at ${account.name}.`;
  },
};

const createText = {
  weeksAway,
  weekAway,
  sameWeek,
  sameDay,
};

export default function createReminderText({ patient, account, appointment, reminder = {}, currentDate = nowISO() }) {
  const type = getReminderType({ appointment, reminder, currentDate });
  const subtype = appointment.isPatientConfirmed ? 'confirmed' : 'unconfirmed';
  return createText[type][subtype]({ patient, account, appointment });
}

export function getReminderType({ appointment, reminder, currentDate = nowISO() }) {
  if (!appointment && !reminder) {
    throw new Error('Must pass in at least an appointment or a reminder to determine type');
  }

  // If appointment is not defined, assume reminder is there and get apptDate from there to determine type
  let apptDate = moment().add(convertIntervalStringToObject(reminder.interval));
  if (appointment && appointment.startDate) {
    apptDate = moment(appointment.startDate);
  }

  // Now see how many days away it is, and categorize it
  const daysDiff = apptDate.diff(currentDate, 'days');
  if (daysDiff >= 8) {
    return 'weeksAway';
  } else if (8 >= daysDiff && daysDiff >= 5) {
    return 'weekAway';
  } else if (5 >= daysDiff && daysDiff > 0) {
    return 'sameWeek';
  } else if (daysDiff === 0) {
    return 'sameDay';
  }
}


export function getReminderTemplateName({ isConfirmable, reminder }) {
  const typeMap = {
    weeksAway: 'Weeks Away',
    weekAway: 'Week Away',
    sameWeek: 'Same Week',
    sameDay: 'Same Day',
  };

  const type = getReminderType({ reminder });
  const confirmType = isConfirmable === 'true' ? 'Unconfirmed' : 'Confirmed';
  return `Appointment Reminder - ${typeMap[type]} - ${confirmType}`;
}
