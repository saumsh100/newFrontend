
import { capitalize } from '@carecru/isomorphic';
import { getTemplateSubType } from './templates/helpers';
import getReminderTemplate from './templates/reminders';

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
export function reminderSent({
  interval,
  primaryType,
  isConfirmable,
  contactedPatientId,
  isFamily,
  patient: { firstName, lastName },
  reminder = {},
}, { id: appointmentPatientId }) {
  const { isCustomConfirm } = reminder;

  const reminderTypeMap = {
    0: {
      0: 'Confirmed',
      1: 'Pre-Confirmed',
    },
    1: {
      0: 'Unconfirmed',
      1: 'Unpreconfirmed',
    },
  };

  const type = reminderTypeMap[Number(isConfirmable)][Number(isCustomConfirm)];

  const reminderType = `${capitalize(interval)} ${typeMap[primaryType]} ${type}`;
  const subType = getTemplateSubType({
    isFamily,
    contactedPatientId,
    appointmentPatientId,
  });

  return getReminderTemplate('sent')(subType)({
    reminderType,
    contactedPatientName: `${firstName} ${lastName}`,
  });
}

/**
 * reminderConfirmed will generate the correspondance note for a REMINDER:CONFIRMED
 *
 * @param sentReminder
 * @return {string}
 */
export function reminderConfirmed({
  interval,
  primaryType,
  contactedPatientId,
  isFamily,
  patient: { firstName, lastName },
  reminder = {},
}, {
  id: appointmentPatientId,
  firstName: pFirstName,
  lastName: pLastName,
}) {
  const { isCustomConfirm } = reminder;
  const action = isCustomConfirm ? 'Pre-Confirmed' : 'Confirmed';
  const reminderType = `${capitalize(interval)} ${typeMap[primaryType]}`;
  const subType = getTemplateSubType({
    isFamily,
    contactedPatientId,
    appointmentPatientId,
  });

  return getReminderTemplate('confirmed')(subType)({
    action,
    reminderType,
    contactedPatientName: `${firstName} ${lastName}`,
    appointmentPatientName: `${pFirstName} ${pLastName}`,
  });
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

  return `Sent "${capitalize(prettyInterval)} ${time} Due Date" ${typeMap[primaryType]} Recall via CareCru`;
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
