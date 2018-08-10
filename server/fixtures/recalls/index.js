
// TODO: replace this by importing account seeds and pulling
// This is the accountId2
const uuid = require('uuid').v4;
const accountId2 = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const accountId = '2aeab035-b72c-4f7a-ad73-09465cbf5654';


export const recallIdtest = uuid();
export default [
  {
    // 6 month recall
    accountId: accountId2,
    primaryType: 'email',
    lengthSeconds: 6 * 30 * 24 * 60 * 60,
  },
  {
    id: recallIdtest,
    accountId,
    primaryType: 'email',
    lengthSeconds: 6 * 30 * 24 * 60 * 60,
  },
];
