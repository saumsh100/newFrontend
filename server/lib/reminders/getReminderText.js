
import moment from 'moment-timezone';
import { formatPhoneNumber } from '../../util/formatters';
import createReminderText, { getReminderType } from './createReminderText';
import { getMessageFromTemplates } from '../../services/communicationTemplate';
import isFeatureFlagEnabled from "../featureFlag";

const NUM_DAYS = 2;

const getDateAndTime = (date, timezone) => {
  const mDate = moment.tz(date, timezone);
  return {
    date: mDate.format('MMMM Do'),
    time: mDate.format('h:mma'),
  };
};

const templateTypes = {
  weeksAway: 'weeks-away',
  weekAway: 'week-away',
  sameWeek: 'same-week',
  sameDay: 'same-day',
};

/**
 *
 * @param patient
 * @param account
 * @param appointment
 * @param reminder
 * @param currentDate
 * @param isConfirmable
 * @param isCustomizable
 * @return {Promise<*>}
 */
export default async function getReminderText({
  patient,
  account,
  appointment,
  reminder,
  currentDate,
  isConfirmable,
}) {
  // Feature flag is here so that both the Preview API and the actual
  // reminders job can utilize the same function
  const isCustomizable = await isFeatureFlagEnabled(
    'customizable-reminders-templates',
    false,
    {
      userId: 'carecru-api',
      accountId: account.id,
      enterpriseId: account.enterpriseId,
    },
  );

  if (!isCustomizable) {
    return createReminderText({
      patient,
      account,
      appointment,
      reminder,
      currentDate,
      isConfirmable,
    });
  }

  // Don't pass in appointment so it uses the reminder.interval instead
  const reminderType = getReminderType({
    account,
    reminder,
    currentDate,
  });

  const reminderTemplateType = templateTypes[reminderType];
  const subType = !isConfirmable ? 'confirmed' : 'unconfirmed';
  const templateName = `reminder-sms-${reminderTemplateType}-${subType}`;

  const action = reminder.isCustomConfirm ? 'pre-confirm' : 'confirm';
  const { date, time } = getDateAndTime(appointment.startDate, account.timezone);
  const name = account.name;
  const numDays = NUM_DAYS;
  const firstName = patient.firstName;
  const phoneNumber = formatPhoneNumber(account.destinationPhoneNumber);

  const parameters = {
    date,
    name,
    time,
    action,
    numDays,
    firstName,
    phoneNumber,
  };

  return await getMessageFromTemplates(
    account.id,
    templateName,
    parameters,
  );
}
