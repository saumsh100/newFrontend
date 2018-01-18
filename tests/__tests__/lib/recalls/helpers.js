
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
  Appointment,
  Patient,
  Practitioner,
  Recall,
  SentRecall,
} from '../../../../server/_models';
import {
  mapPatientsToRecalls,
  getPatientsDueForRecall,
} from '../../../../server/lib/recalls/helpers';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';
import { w2s } from '../../../../server/util/time';

// TODO: make seeds more modular so we can see here
// const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
// const patientId = '3aeab035-b72c-4f7a-ad73-09465cbf5654';
const oneDayReminderId = '8aeab035-b72c-4f7a-ad73-09465cbf5654';

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
  lengthSeconds: w2s(-1),
  primaryType: 'email',
}, data);

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();
const dates = (y, m, d, h) => {
  return {
    startDate: date(y, m, d, h),
    endDate: date(y, m, d, h + 1),
  };
};

describe('Recalls Calculation Library', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('Helpers', () => {
    describe('#getPatientsDueForRecall', () => {
      test.skip('should be a function', () => {
        expect(typeof getPatientsDueForRecall).toBe('function');
      });

      let recall;
      let appointments;
      let patients;
      beforeEach(async () => {
        recall = await Recall.create({ accountId, primaryType: 'email', lengthSeconds: w2s(-1) });
        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Old', lastName: 'Patient' }),
          makePatientData({ firstName: 'Recent', lastName: 'Patient' }),
          makePatientData({ firstName: 'Recent', lastName: 'Patient', preferences: { reminders: false } }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2014, 7, 5, 8) }),
          makeApptData({ patientId: patients[1].id, ...dates(2016, 7, 5, 9) }),
          makeApptData({ patientId: patients[2].id, ...dates(2016, 7, 5, 9) }),
        ]);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      test.skip('should return 1 patient that needs a 1wk past-due recall', async () => {
        const currentDate = date(2017, 1, 8, 8);
        const account = { id: accountId, recallDueDateSeconds: 15552000 };
        const pts = await getPatientsDueForRecall({ recall, account, date: currentDate });
        expect(pts.length).toBe(1);
        expect(pts[0].id).toBe(patients[1].id);
      });

      test.skip('should return 0 patients, (1 really old, 1 too recent)', async () => {
        // TODO: need to fix this by forcing timezone!
        const currentDate = date(2017, 1, 8, 8);
        const account = { id: accountId, recallDueDateSeconds: 15552000 };
        await Appointment.create(makeApptData({ patientId: patients[1].id, ...dates(2017, 7, 5, 9) }));
        const pts = await getPatientsDueForRecall({ recall, account, date: currentDate });
        expect(pts.length).toBe(0);
      });
    });

    describe('#mapPatientsToRecalls', () => {
      test('should be a function', () => {
        expect(typeof mapPatientsToRecalls).toBe('function');
      });

      let recalls;
      let appointments;
      let patients;
      beforeEach(async () => {
        recalls = await Recall.bulkCreate([
          {
            accountId,
            primaryType: 'email',
            lengthSeconds: w2s(-1),
          },
          /*{
            accountId,
            primaryType: 'email',
            lengthSeconds: 18144000,
          },*/
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Old', lastName: 'Patient' }),
          makePatientData({ firstName: 'Recent', lastName: 'Patient' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
          makeApptData({ patientId: patients[1].id, ...dates(2016, 7, 5, 9) }),
          makeApptData({ patientId: patients[1].id, isCancelled: true, ...dates(2017, 8, 5, 9) }),
          makeApptData({ patientId: patients[1].id, isShortCancelled: true, ...dates(2017, 8, 5, 9) }),
          makeApptData({ patientId: patients[1].id, isPending: true, ...dates(2017, 8, 5, 9) }),
        ]);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      test.skip('should return 2 patients for the recall, but both failed because no email', async () => {
        const currentDate = date(2017, 1, 8, 8);
        const account = { id: accountId, recallDueDateSeconds: 15552000 };
        const recallsPatients = await mapPatientsToRecalls({ recalls, account, date: currentDate });
        expect(recallsPatients[0].errors.length).toBe(2);
        expect(recallsPatients[0].success.length).toBe(0);
      });

      test.skip('should return 1 patient for each recall, but both success', async () => {
        const currentDate = date(2017, 1, 8, 8);
        const account = { id: accountId, recallDueDateSeconds: 15552000 };
        await patients[0].update({ email: 'justin+test1@carecru.com' });
        await patients[1].update({ email: 'justin+test2@carecru.com' });
        const recallsPatients = await mapPatientsToRecalls({ recalls, account, date: currentDate });
        expect(recallsPatients[0].errors.length).toBe(0);
        expect(recallsPatients[0].success.length).toBe(2);
      });
    });

    describe('#mapPatientsToRecalls - cancelled appointments', () => {
      let recalls;
      let appointments;
      let patients;
      beforeEach(async () => {
        recalls = await Recall.bulkCreate([
          {
            accountId,
            primaryType: 'email',
            lengthSeconds: w2s(-1),
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Old', lastName: 'Patient', email: 'justin+test1@carecru.com' }),
          makePatientData({ firstName: 'Recent', lastName: 'Patient', email: 'justin+test2@carecru.com' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
          makeApptData({ patientId: patients[1].id, ...dates(2016, 7, 5, 9) }),
        ]);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      test.skip('should return 1 patient for each recall, but both success', async () => {
        const currentDate = date(2017, 1, 8, 8);
        const account = { id: accountId, recallDueDateSeconds: 15552000 };

        const recallsPatients = await mapPatientsToRecalls({ recalls, account, date: currentDate });
        expect(recallsPatients[0].errors.length).toBe(0);
        expect(recallsPatients[0].success.length).toBe(2);
      });

      test.skip('should return 1 patient  and one recall as one appointment is cancelled', async () => {
        const currentDate = date(2017, 1, 8, 8);
        const account = { id: accountId, recallDueDateSeconds: 15552000 };

        await appointments[0].update({ isShortCancelled: true });

        const recallsPatients = await mapPatientsToRecalls({ recalls, account, date: currentDate });
        expect(recallsPatients[0].errors.length).toBe(0);
        expect(recallsPatients[0].success.length).toBe(1);
      });
    });

    describe('#mapPatientsToRecalls - pending appointments', () => {
      let recalls;
      let appointments;
      let patients;
      beforeEach(async () => {
        recalls = await Recall.bulkCreate([
          {
            accountId,
            primaryType: 'email',
            lengthSeconds: w2s(-1),
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Old', lastName: 'Patient', email: 'justin+test1@carecru.com' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2016, 7, 5, 9) }),
          makeApptData({ patientId: patients[0].id, ...dates(2017, 2, 5, 9) }),
        ]);
      });

      afterAll(async () => {
        await wipeAllModels();
      });

      test('should have no recall sent as patient as appointment in two days', async () => {
        const currentDate = date(2017, 1, 8, 8);
        const account = { id: accountId, recallDueDateSeconds: 15552000 };

        const recallsPatients = await mapPatientsToRecalls({ recalls, account, date: currentDate });
        expect(recallsPatients[0].errors.length).toBe(0);
        expect(recallsPatients[0].success.length).toBe(0);
      });

      test.skip('should return 1 patient  and one recall as the appointments is pendding', async () => {
        const currentDate = date(2017, 1, 8, 8);
        const account = { id: accountId, recallDueDateSeconds: 15552000 };

        await appointments[1].update({ isPending: true });

        const recallsPatients = await mapPatientsToRecalls({ recalls, account, date: currentDate });
        expect(recallsPatients[0].errors.length).toBe(0);
        expect(recallsPatients[0].success.length).toBe(1);
      });
    });
  });
});

