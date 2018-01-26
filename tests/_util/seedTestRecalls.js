import { Recall } from '../../server/_models';
import wipeModel from './wipeModel';
import { accountId } from './seedTestUsers';

const recallId1 = 'd5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const recallId2 = 'e5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';

const recall1 = {
  id: recallId1,
  accountId,
  primaryTypes: ['sms'],
  interval: ['-1 months'],
  createdAt: '2017-07-19T00:14:30.932Z',
};

const recall2 = {
  id: recallId2,
  accountId,
  primaryTypes: ['sms'],
  interval: ['1 months'],
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestRecalls() {
  await wipeModel(Recall);

  // seed recalls
  await Recall.bulkCreate([recall1, recall2]);
}

module.exports = {
  recallId1,
  recallId2,
  seedTestRecalls,
};
