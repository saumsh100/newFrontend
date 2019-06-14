
import { getReminderTemplateType } from '../util';

/**
 * Generates the reminder message template name based of the sent reminder's data
 * @param props
 * @return {Promise<string>}
 */
export default async function getReminderTemplate(props) {
  const { isConfirmable } = props;

  const reminderTemplateType = getReminderTemplateType(props);

  const subType = !isConfirmable ? 'confirmed' : 'unconfirmed';
  return `reminder-sms-${reminderTemplateType}-${subType}`;
}
