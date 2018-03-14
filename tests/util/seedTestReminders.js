
import { Reminder } from '../../server/_models';
import { accountId } from './seedTestUsers';
import wipeModel from './wipeModel';

const reminderId1 = 'd5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const reminderId2 = 'e5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';

const reminder1 = {
  id: reminderId1,
  accountId,
  interval: '2 days',
  primaryTypes: ['sms'],
  createdAt: '2017-07-19T00:14:30.932Z',
};

const reminder2 = {
  id: reminderId2,
  accountId,
  interval: '2 hours',
  primaryTypes: ['sms'],
  createdAt: '2017-07-19T00:14:30.932Z',
};

async function seedTestReminders() {
  await wipeModel(Reminder);

  await Reminder.bulkCreate([
    reminder1,
    reminder2,
  ]);
}

module.exports = {
  reminderId1,
  reminderId2,
  seedTestReminders,
};
