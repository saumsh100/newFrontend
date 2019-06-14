
import { dateFormatter } from '@carecru/isomorphic';
import { stringify } from 'query-string';
import getVoiceTemplateName from '../reminderTemplate/getVoiceBin';
import { getAccountConnectorConfigurations } from '../../accountConnectorConfigurations';
import { apiServerUrl } from '../../../config/globals';
import twilioClient from '../../../config/twilio';

/**
 * Make a phone call for reminder.
 * @param account
 * @param appointment
 * @param patient
 * @param sentReminder
 * @return {*}
 */
export default async function phoneCall({
  account,
  appointment,
  patient,
  sentReminder: { id: sentReminderId, isConfirmable } = {},
  dependants = [],
  confirmAppointmentEndpoint,
  binName,
  familyMembersAndTimes,
}) {
  const practiceName = account.name;
  const practiceNumber = account.phoneNumber;
  const phoneNumber = patient.cellPhoneNumber;

  const startDateTime = appointment.startDate;
  const startDate = dateFormatter(startDateTime, account.timezone, 'MMMM Do');
  const startTime = dateFormatter(startDateTime, account.timezone, 'h:mma');

  const isFamily = dependants && dependants.length > 0;
  const familyMembers = appointment ? [patient, ...dependants] : dependants;

  const query = stringify({
    practiceName,
    startDate,
    startTime,
    practiceNumber,
    confirmAppointmentEndpoint:
      confirmAppointmentEndpoint || generateCallBackUrl(sentReminderId),
    dependants:
      familyMembersAndTimes ||
      familyMembers
        .map(
          p =>
            `${p.firstName} ${p.lastName} at ${dateFormatter(
              p.appointment.startDate,
              account.timezone,
              'h:mma',
            )}`,
        )
        .join(', '),
  });

  const config = await getAccountConnectorConfigurations(account.id);
  const binUrl = config.find(
    v => v.name === (binName || getVoiceTemplateName(isConfirmable, isFamily)),
  ).value;

  return twilioClient.calls.create({
    to: `${phoneNumber}`,
    from: account.twilioPhoneNumber,
    url: `${binUrl}?${query}`,
    timeout: '15',
  });
}

/**
 * Generate the callBack URL for phone calls.
 * @param param.account
 * @param param.appointment
 * @param param.patient
 * @param param.sentReminder
 * @return {string} the built callback url
 */
function generateCallBackUrl(sentReminderId) {
  return `${apiServerUrl}/twilio/voice/sentReminders/${sentReminderId}/confirm`;
}
