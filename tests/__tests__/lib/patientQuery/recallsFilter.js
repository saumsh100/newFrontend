import * as recallsFilterLibrary from '../../../../server/lib/patientsQuery/recallsFilter';

import { Account, Patient, Appointment, SentRecall, Recall } from '../../../../server/_models';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { patientId, patient, seedTestPatients } from '../../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
}, data);

const makeSentRecallData = (data = {}) => Object.assign({
  // Doesnt even have to match recall for this test
  patientId,
  accountId,
  lengthSeconds: 15552000,
  createdAt: date(2000, 10, 10, 9),
}, data);

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();
const dates = (y, m, d, h) => {
  return {
    startDate: date(y, m, d, h),
    endDate: date(y, m, d, h + 1),
  };
};

describe('Recalls Filters Tests', () => {
  afterAll(async () => {
    await wipeAllModels();
  });

  beforeAll(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
  });

  describe('Recalls Filter ', () => {
    test('Should have 1 patient who has received a recall email', async () => {

      const recall = await Recall.create({ accountId, primaryType: 'email', lengthSeconds: 15552000 });

      const recallPlain = recall.get({ plain: true });

      const sentRecall = await SentRecall.create(makeSentRecallData({ recallId: recallPlain.id, primaryType: 'email' }));

      const data = [date(2000, 7, 5, 8), date(2000, 12, 5, 8)];

      const patientsData = await recallsFilterLibrary.RecallsFilter({ data, key: 'email' }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(1);
    });

    test('Should have 1 patient who has received a recall sms', async () => {

      const recall = await Recall.create({ accountId, primaryType: 'sms', lengthSeconds: 15552000 });

      const recallPlain = recall.get({ plain: true });

      const sentRecall = await SentRecall.create(makeSentRecallData({ recallId: recallPlain.id, primaryType: 'sms' }));

      const data = [date(2000, 7, 5, 8), date(2000, 12, 5, 8)];

      const patientsData = await recallsFilterLibrary.RecallsFilter({ data, key: 'sms' }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(1);
    });

    test('Should have 1 patient who has received a recall phone', async () => {

      const recall = await Recall.create({ accountId, primaryType: 'phone', lengthSeconds: 15552000 });

      const recallPlain = recall.get({ plain: true });

      const sentRecall = await SentRecall.create(makeSentRecallData({ recallId: recallPlain.id, primaryType: 'phone' }));

      const data = [date(2000, 7, 5, 8), date(2000, 12, 5, 8)];

      const patientsData = await recallsFilterLibrary.RecallsFilter({ data, key: 'phone' }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(1);
    });
  });
});
