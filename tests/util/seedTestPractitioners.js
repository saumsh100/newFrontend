
import bcrypt from 'bcrypt';
import { passwordHashSaltRounds } from '../../server/config/globals';
import { Practitioner } from '../../server/models';
import wipeModel from './wipeModel';
import { accountId } from './seedTestUsers';
import { weeklyScheduleId, seedTestWeeklySchedules } from './seedTestWeeklySchedules';

const practitionerId = '497ff59a-4bae-4013-bdce-b6b5be91a1f5';
const practitioner = {
  id: practitionerId,
  accountId,
  firstName: 'Colonel',
  lastName: 'Sanders',
  weeklyScheduleId,
  createdAt: '2017-07-19T00:14:30.932Z',
  type: 'Hygienist',
  isActive: true,
};

async function seedTestPractitioners() {
  await seedTestWeeklySchedules();
  await wipeModel(Practitioner);
  await Practitioner.save(practitioner);
}

module.exports = {
  practitioner,
  practitionerId,
  seedTestPractitioners,
};
