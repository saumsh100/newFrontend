
import { w2s } from '../../util/time';

/**
 * Default Recalls, 17 total touchpoints, all email
 */
const defaultRecalls = [
  {
    primaryType: 'email',
    lengthSeconds: w2s(1),
  },
  {
    primaryType: 'email',
    lengthSeconds: w2s(-1),
  },
  {
    primaryType: 'sms',
    lengthSeconds: w2s(-4),
  },
  {
    primaryType: 'sms',
    lengthSeconds: w2s(-8),
  },
  {
    primaryType: 'sms',
    lengthSeconds: w2s(-12),
  },
  {
    primaryType: 'sms',
    lengthSeconds: w2s(-20),
  },
  {
    primaryType: 'sms',
    lengthSeconds: w2s(-28),
  },
  {
    primaryType: 'sms',
    lengthSeconds: w2s(-36),
  },
  {
    primaryType: 'sms',
    lengthSeconds: w2s(-44),
  },
  {
    primaryType: 'sms',
    lengthSeconds: w2s(-52),
  },
  {
    primaryType: 'sms',
    lengthSeconds: w2s(-60),
  },
  {
    primaryType: 'sms',
    lengthSeconds: w2s(-68),
  },
  {
    primaryType: 'sms',
    lengthSeconds: w2s(-76),
  },
  {
    primaryType: 'sms',
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
