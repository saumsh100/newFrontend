import moment from 'moment';

export function reminderSentNote(method, date) {
  date = date || moment();
  return `- CareCru: A Reminder was sent via ${method.toLowerCase()} on ${moment(date).format('LLL')} for this appointment`;
}

export function reminderConfirmedNote(method, date) {
  date = date || moment();
  return `- Carecru: Patient has confirmed via ${method.toLowerCase()} on ${moment(date).format('LLL')} for this appointment`;
}
