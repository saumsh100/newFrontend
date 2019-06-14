
/**
 * Generates the template name for the confirmation text based of the sent reminder's data
 * @param isFamily
 * @param sentRemindersPatients
 * @return {string}
 */
export default function getConfirmationTextTemplate({
  isFamily,
  sentRemindersPatients,
}) {
  const templatePrefix = 'reminder-sms-confirmation';

  if (!isFamily) {
    return templatePrefix;
  }

  return sentRemindersPatients.length > 1
    ? `${templatePrefix}-family-multiple`
    : `${templatePrefix}-family-single`;
}
