
import { d2s, h2s } from '../../util/time';

/**
 * Default Reminders
 */
const defaultReminders = [
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: d2s(21),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: d2s(7),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: d2s(2),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: h2s(2),
  },
];

/**
 * generateDefaultReminders will add appropriate data to the defaults
 * based on account
 *
 * @param account
 * @returns Array
 */
export function generateDefaultReminders(account) {
  return defaultReminders.map((r) => {
    r.accountId = account.id;
    return r;
  });
}
