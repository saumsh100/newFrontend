
import { d2s, h2s } from '@carecru/isomorphic';

/**
 * Default Reminders
 */
const defaultReminders = [
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: d2s(21),
    interval: '21 days',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: d2s(7),
    interval: '7 days',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: d2s(2),
    interval: '2 days',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: h2s(2),
    interval: '2 hours',
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
