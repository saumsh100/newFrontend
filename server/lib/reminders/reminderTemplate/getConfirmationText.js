
import { shouldUseLegacyTemplate } from './util';
import getConfirmationTextValue from './getConfirmationText/getConfirmationTextValue';
import getConfirmationTextTemplate from './getConfirmationText/getConfirmationTextTemplate';
import createConfirmationText from '../createConfirmationText';
import { getMessageFromTemplates } from '../../../services/communicationTemplate';

/**
 *
 * @param props.patient,
 * @param props.account,
 * @param props.appointment,
 * @param props.reminder,
 * @param props.isFamily,
 * @param props.sentRemindersPatients,
 * @return {Promise<*>}
 */
export default async function getConfirmationText(props) {
  const {
    account,
    reminder: { isCustomConfirm },
  } = props;

  if (await shouldUseLegacyTemplate(account)) {
    return createConfirmationText(props);
  }

  const action = isCustomConfirm ? 'pre-confirmed' : 'confirmed';

  const templateName = await getConfirmationTextTemplate(props);
  const templateValue = await getConfirmationTextValue({
    action,
    ...props,
  });

  return getMessageFromTemplates(account.id, templateName, templateValue);
}
