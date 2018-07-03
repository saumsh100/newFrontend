
import { Chair } from '../../server/_models';
import { accountId } from './seedTestUsers';
import wipeModel from './wipeModel';

const chairId = '24d4e661-1455-4494-8fdb-c4ec0ddf804d';

const chair = {
  id: chairId,
  accountId,
  name: 'C5',
  pmsId: '5',
};

async function seedTestChairs() {
  await wipeModel(Chair);

  await Chair.create(chair);
}

module.exports = {
  chair,
  chairId,
  seedTestChairs,
};
