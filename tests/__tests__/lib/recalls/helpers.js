
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
  getPatientsDueForRecall,
} from '../../../../server/lib/recalls/helpers';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';

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
  lengthSeconds: 15552000,
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
      test('should be a function', () => {
        expect(typeof getPatientsDueForRecall).toBe('function');
      });

      let recall;
      let appointments;
      let patients;
      beforeEach(async () => {
        recall = await Recall.create({ accountId, primaryType: 'email', lengthSeconds: 15552000 });
        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Old', lastName: 'Patient' }),
          makePatientData({ firstName: 'Recent', lastName: 'Patient' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ patientId: patients[0].id, ...dates(2014, 7, 5, 8) }), // Today at 8
          makeApptData({ patientId: patients[1].id, ...dates(2016, 7, 5, 9) }), // Today at 9
        ]);
      });

      test('should return 1 patient that needs a recall', async () => {
        const currentDate = date(2017, 7, 5, 7);
        const account = { id: accountId };
        const pts = await getPatientsDueForRecall({ recall, account, date: currentDate });
        expect(pts.length).toBe(1);
        expect(pts[0].id).toBe(patients[1].id);
      });

      test.skip('should return 0 patients, (1 really old, 1 too recent)', async () => {
        const currentDate = date(2017, 7, 5, 7);
        const account = { id: accountId };
        const recentAppt = await Appointment.create(makeApptData({ patientId: patients[1].id, ...dates(2017, 7, 5, 9) }));
        const pts = await getPatientsDueForRecall({ recall, account, date: currentDate });
        expect(pts.length).toBe(0);
      });
    });
  });
});

