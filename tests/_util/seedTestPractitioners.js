
import bcrypt from 'bcrypt';
import { passwordHashSaltRounds } from '../../server/config/globals';
import { Practitioner, Service, Practitioner_Service } from '../../server/_models';
import wipeModel, { wipeModelSequelize } from './wipeModel';
import { accountId } from './seedTestUsers';
import { weeklyScheduleId, seedTestWeeklySchedules } from './seedTestWeeklySchedules';

const practitionerId = '497ff59a-4bae-4013-bdce-b6b5be91a1f5';
const cleanupServiceId = '1f439ff8-c55d-4423-9316-a41240c4d329';

const practitioner = {
  id: practitionerId,
  accountId,
  firstName: 'Colonel',
  lastName: 'Sanders',
  weeklyScheduleId,
  createdAt: '2017-07-19T00:14:30.932Z',
  type: 'Hygienist',
  isActive: true,
  isHidden: false,
  isCustomSchedule: true,
};

const pracService = {
  practitionerId: practitionerId,
  serviceId: cleanupServiceId,
};

const service = {
  id: cleanupServiceId,
  accountId,
  name: 'Cleanup',
  duration: 60,
  bufferTime: 0,
  unitCost: 40,
};

async function seedTestPractitioners() {
  await seedTestWeeklySchedules();
  await wipeModel(Practitioner);
  await wipeModel(Practitioner_Service);
  await wipeModel(Service);
  await Practitioner.create(practitioner);
  await Service.create(service);
  await Practitioner_Service.create(pracService);
}

module.exports = {
  practitioner,
  practitionerId,
  seedTestPractitioners,
};
