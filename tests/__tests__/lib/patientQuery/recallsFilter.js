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

const makeSentRecallData2 = (data = {}) => Object.assign({
  // Doesnt even have to match recall for this test
  accountId,
  lengthSeconds: 15552000,
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

  beforeEach(async () => {
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

  describe('Last Recall Filter ', () => {
    test('Should have 2 patients who have a last recall, ordered by firstName', async () => {

      const recall = await Recall.bulkCreate([
        {accountId, primaryType: 'email', lengthSeconds: 15552000},
        {accountId, primaryType: 'sms', lengthSeconds: 1231233},
      ]);

      const recallPlain = recall[0].get({plain: true});
      const recallPlain1 = recall[1].get({plain: true});
      const recallPlain2 = recall[1].get({plain: true});


      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient' }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient' }),
      ]);

      const appointments = await Appointment.bulkCreate([
        makeApptData({ patientId: patients[0].id, ...dates(2000, 7, 5, 8) }),
        makeApptData({ patientId: patients[0].id, ...dates(2000, 8, 5, 9) }),
        makeApptData({ patientId: patients[1].id, ...dates(2000, 11, 5, 9) }),
      ]);

      const sentRecall = await SentRecall.bulkCreate([
        makeSentRecallData2({
          recallId: recallPlain.id,
          primaryType: 'email',
          patientId: patients[0].id,
          appointmentId: appointments[0].id,
          createdAt: date(2000, 10, 10, 10),
        }),
        makeSentRecallData2({
          recallId: recallPlain1.id,
          primaryType: 'sms',
          patientId: patients[0].id,
          appointmentId: appointments[1].id,
          createdAt: date(2000, 10, 10, 9),
        }),
        makeSentRecallData2({
          recallId: recallPlain2.id,
          primaryType: 'sms',
          patientId: patients[1].id,
          appointmentId: appointments[2].id,
          createdAt: date(2000, 12, 10, 9),
        }),
      ]);

      const data = [date(2000, 8, 5, 8), date(2000, 12, 11, 8)];
      const query = {
        order: [['firstName', 'ASC']],
      };

      const patientsData = await recallsFilterLibrary.LastRecallFilter({ data }, [], query, accountId);

      expect(patientsData.rows.length).toBe(2);
      expect(patientsData.rows[0].firstName).toBe('Old');
    });
  });
});
