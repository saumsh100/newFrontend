
import getReminderValue from './getSmsText/getReminderValue';
import getReminderTemplate from './getSmsText/getReminderTemplate';
import { isFamily, shouldUseLegacyTemplate } from './util';
import createFamilyReminderText from '../createFamilyReminderText';
import createReminderText from '../createReminderText';
import { getMessageFromTemplates } from '../../../services/communicationTemplate';

/**
 * Function that gets or builds the body for reminders text message
 * Based on the feature flag we will return the legacy texts or the one based off the templating
 * system.
 * @param props.patient
 * @param props.account
 * @param props.appointment
 * @param props.reminder
 * @param props.currentDate
 * @param props.isConfirmable
 * @param props.isCustomizable
 * @return {Promise<*>}
 */
export default async function getSmsText(props) {
  const {
    account,
    dependants,
  } = props;

  if (await shouldUseLegacyTemplate(account)) {
    return isFamily(dependants)
      ? createFamilyReminderText(props)
      : createReminderText(props);
  }

  const templateName = await getReminderTemplate(props);
  const templateValue = await getReminderValue(props);

  return getMessageFromTemplates(account.id, templateName, templateValue);
}

