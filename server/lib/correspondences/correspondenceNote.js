
import moment from 'moment';

const cap = str => str.replace(/\b\w/g, l => l.toUpperCase());
const typeMap = {
  email: 'Email',
  sms: 'SMS',
  phone: 'Phone',
};

export function reminderSent(sentReminder) {
  const {
    interval,
    primaryType,
    isConfirmable,
  } = sentReminder;
  const type = isConfirmable ? 'Confirmed' : 'Unconfirmed';
  return `Sent "${cap(interval)} ${typeMap[primaryType]} ${type}" Reminder for Appointment via CareCru`;
}

export function reminderConfirmed(sentReminder) {
  const {
    interval,
    primaryType,
  } = sentReminder;
  return `Patient Confirmed "${cap(interval)} ${typeMap[primaryType]} ${type}" Reminder for Appointment via CareCru`;
}

export function recallSent(sentRecall) {
  const {
    interval,
    primaryType,
  } = sentRecall;
  const time = interval.indexOf('-') > -1 ? 'After' : 'Before';
  return `Sent "${cap(interval)} ${time} Due Date" ${typeMap[primaryType]} Recall via CareCru`;
}
