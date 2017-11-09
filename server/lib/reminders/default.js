
import { d2s, h2s } from '../../util/time';

/**
 * Default Reminders
 */
export const defaultReminders = [
  {
    primaryType: 'email',
    lengthSeconds: d2s(21),
  },
  {
    primaryType: 'sms',
    lengthSeconds: d2s(7),
  },
  {
    primaryType: 'sms',
    lengthSeconds: d2s(2),
  },
  {
    primaryType: 'sms',
    lengthSeconds: h2s(2),
  },
];

/**
 * generateDefaultReminders will add appropriate data to the defaults
 * based on account
 *
 * @param account
 * @returns array
 */
export function generateDefaultReminders(account) {
  return exports.defaultReminders.map(r => r.accountId = account.id);
}
