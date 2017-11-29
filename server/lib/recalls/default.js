
import { w2s } from '../../util/time';

/**
 * Default Recalls, 17 total touchpoints, all email
 */
const defaultRecalls = [
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(4),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(1),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-1),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-4),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-8),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-12),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-20),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-28),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-36),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-44),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-52),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-60),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-68),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-76),
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-84),
  },
];

/**
 * generateDefaultRecalls will add appropriate data to the defaults
 * based on account
 *
 * @param account
 * @returns Array
 */
export function generateDefaultRecalls(account) {
  return defaultRecalls.map((r) => {
    r.accountId = account.id;
    return r;
  });
}
