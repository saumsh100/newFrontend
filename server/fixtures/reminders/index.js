
// TODO: replace this by importing account seeds and pulling
// This is the accountId2
const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const reminderId = '8aeab035-b72c-4f7a-ad73-09465cbf5654';

export default [
  {
    // 21 day email
    accountId,
    primaryType: 'email',
    lengthSeconds: 21 * 24 * 60 * 60,
  },
  {
    // 7 day sms
    accountId,
    primaryType: 'sms',
    lengthSeconds: 7 * 24 * 60 * 60,
  },
  {
    // 1 day sms
    id: reminderId,
    accountId,
    primaryType: 'phone',
    lengthSeconds: 24 * 60 * 60,
  },
  {
    // 2 hour sms
    accountId,
    primaryType: 'sms',
    lengthSeconds: 2 * 60 * 60,
  },
];
