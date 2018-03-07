
import { getIsConfirmable } from '../reminders/sendReminder';

const cap = str => str.replace(/\b\w/g, l => l.toUpperCase());
const typeMap = {
  email: 'Email',
  sms: 'SMS',
  phone: 'Phone',
};

/**
 * reminderSent will generate the correspondance note for a REMINDER:SENT
 *
 * @param sentReminder
 * @return {string}
 */
export function reminderSent(sentReminder) {
  const {
    interval,
    primaryType,
    isConfirmable,
    reminder = {},
  } = sentReminder;
  const { isCustomConfirm } = reminder;
  const type = isConfirmable ?
    (isCustomConfirm ? 'Unpreconfirmed' : 'Unconfirmed') :
    (isCustomConfirm ? 'Pre-Confirmed' : 'Confirmed');

  return `Sent "${cap(interval)} ${typeMap[primaryType]} ${type}" Reminder for Appointment via CareCru`;
}

/**
 * reminderConfirmed will generate the correspondance note for a REMINDER:CONFIRMED
 *
 * @param sentReminder
 * @return {string}
 */
export function reminderConfirmed(sentReminder) {
  const {
    interval,
    primaryType,
    reminder = {},
  } = sentReminder;
  const action = reminder.isCustomConfirm ? 'Pre-Confirmed' : 'Confirmed';
  return `Patient ${action} "${cap(interval)} ${typeMap[primaryType]}" Reminder for Appointment via CareCru`;
}

/**
 * reminderConfirmed will generate the correspondance note for a RECALL:SENT
 *
 * @param sentRecall
 * @return {string}
 */
export function recallSent(sentRecall) {
  const {
    interval,
    primaryType,
  } = sentRecall;
  let time = 'Before';
  let prettyInterval = interval;
  if (interval.indexOf('-') > -1) {
    time = 'After';
    prettyInterval = interval.slice(1, interval.length);
  }

  return `Sent "${cap(prettyInterval)} ${time} Due Date" ${typeMap[primaryType]} Recall via CareCru`;
}

/**
 * reviewSent will generate the correspondance note for a REVIEW:SENT
 *
 * @param sentReview
 * @return {string}
 */
export function reviewSent(sentReview) {
  const { primaryType } = sentReview;
  return `Sent "${typeMap[primaryType]}" Review Request via CareCru`;
}

/**
 * reviewCompleted will generate the correspondance note for a REVIEW:COMPLETED
 *
 * @param sentReview
 * @return {string}
 */
export function reviewCompleted(sentReview) {
  const { review: { stars } } = sentReview;
  return `Patient Left ${stars}-Star Review via CareCru`;
}
