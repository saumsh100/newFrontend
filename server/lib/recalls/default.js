
import { w2s } from '@carecru/isomorphic';

/**
 * Default Recalls, 17 total touchpoints, all email
 */
const defaultRecalls = [
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(4),
    interval: '1 months',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(1),
    interval: '1 weeks',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-1),
    interval: '-1 weeks',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-4),
    interval: '-1 months',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-8),
    interval: '-2 months',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-12),
    interval: '-4 months',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-20),
    interval: '-6 months',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-28),
    interval: '-8 months',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-36),
    interval: '-10 months',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-44),
    interval: '-12 months',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-52),
    interval: '-14 months',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-60),
    interval: '-16 months',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-68),
    interval: '-18 months',
  },
  /*{
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-76),
    interval: '-20 months',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-84),
    interval: '-22 months',
  },
  {
    primaryTypes: ['email', 'sms'],
    lengthSeconds: w2s(-84),
    interval: '-24 months',
  },*/
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
