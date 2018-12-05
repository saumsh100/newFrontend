
import {
  Account,
  Appointment,
  Patient,
} from 'CareCruModels';
import { generateReviewsOutbox } from '../../../../server/lib/reviews/helpers';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';
import { seedTestChairs, chairId } from '../../../util/seedTestChairs';

const makeApptData = (data = {}) => ({
  accountId,
  patientId,
  practitionerId,
  chairId,
  isPatientConfirmed: true,
  ...data,
});

const makePatientData = (data = {}) => ({
  accountId,
  ...data,
});

const date = (y, m, d, h, mi = 0) => (new Date(y, m, d, h, mi)).toISOString();
const dates = (y, m, d, h) => ({
  startDate: date(y, m, d, h),
  endDate: date(y, m, d, h + 1),
});

describe('Reviews Calculation', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
    await seedTestChairs();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('Helpers', () => {
    describe('#generateReviewsOutbox', () => {
      test('should be a function', () => {
        expect(typeof generateReviewsOutbox).toBe('function');
      });

      let account;
      let appointments;
      let patients;
      beforeEach(async () => {
        account = await Account.findById(accountId);
        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Dustin', lastName: 'Dharp', mobilePhoneNumber: '+12223334444', email: 'dustin@dharp.io' }),
          makePatientData({ firstName: 'Frank', lastName: 'Abagnale', mobilePhoneNumber: '+13334445555', email: 'frank@abagnale.io' }),
          makePatientData({ firstName: 'Ethan', lastName: 'Hunt', mobilePhoneNumber: '+14445556666', email: 'ethan@hunt.io' }),
          makePatientData({ firstName: 'Donald', lastName: 'Trump', mobilePhoneNumber: '+15556667777', email: 'donald@trump.io' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 7, 5, 8), patientId: patients[0].id }), // Aug 5th at 8am - Dustin
          makeApptData({ ...dates(2017, 7, 5, 9), patientId: patients[1].id }), // Aug 5th at 9am - Frank
          makeApptData({ ...dates(2017, 7, 5, 10), patientId: patients[2].id }), // Aug 5th at 10am - Ethan
          makeApptData({ ...dates(2017, 7, 5, 10), patientId: patients[3].id }), // Aug 5th at 9am - Donald
        ]);
      });

      describe('Basic Tests', () => {
        test('should return the all appts for the day, default endDate', async () => {
          const startDate = date(2017, 7, 5, 7);
          const outbox = await generateReviewsOutbox({ account, startDate });
          expect(outbox.length).toBe(4);

          const sendDates = outbox.map(o => o.sendDate);
          expect(sendDates).toEqual([
            date(2017, 7, 5, 9, 15),
            date(2017, 7, 5, 10, 15),
            date(2017, 7, 5, 11, 15),
            date(2017, 7, 5, 11, 15),
          ]);

          const primaryTypes = outbox.map(o => o.primaryTypes);
          expect(primaryTypes).toEqual([
            ['email', 'sms'],
            ['email', 'sms'],
            ['email', 'sms'],
            ['email', 'sms'],
          ]);
        });

        test('should return 1 appt for the range given, endDate is lt no lte', async () => {
          const startDate = date(2017, 7, 5, 9, 15);
          const endDate = date(2017, 7, 5, 10, 15);
          const outbox = await generateReviewsOutbox({ account, startDate, endDate });
          expect(outbox.length).toBe(1);

          const sendDates = outbox.map(o => o.sendDate);
          expect(sendDates).toEqual([
            date(2017, 7, 5, 9, 15),
          ]);

          const primaryTypes = outbox.map(o => o.primaryTypes);
          expect(primaryTypes).toEqual([
            ['email', 'sms'],
          ]);
        });

        test('should return 2 appts for the range given', async () => {
          const startDate = date(2017, 7, 5, 9, 15);
          const endDate = date(2017, 7, 5, 10, 45);
          const outbox = await generateReviewsOutbox({ account, startDate, endDate });
          expect(outbox.length).toBe(2);

          const sendDates = outbox.map(o => o.sendDate);
          expect(sendDates).toEqual([
            date(2017, 7, 5, 9, 15),
            date(2017, 7, 5, 10, 15),
          ]);

          const primaryTypes = outbox.map(o => o.primaryTypes);
          expect(primaryTypes).toEqual([
            ['email', 'sms'],
            ['email', 'sms'],
          ]);
        });
      });

      describe('Multiple Appts Tests', () => {
        let multipleAppts;
        beforeEach(async () => {
          multipleAppts = await Appointment.bulkCreate([
            makeApptData({
              patientId: patients[0].id,
              startDate: date(2017, 7, 5, 9),
              endDate: date(2017, 7, 5, 9, 30),
            }),
          ]);
        });

        test('should not return the 8am appt because Dustin has another one at 9', async () => {
          const startDate = date(2017, 7, 5, 9, 15);
          const endDate = date(2017, 7, 5, 9, 45);
          const outbox = await generateReviewsOutbox({ account, startDate, endDate });
          expect(outbox.length).toBe(0);
        });
      });

      describe('Multiple Appts at same time, default endDate', () => {
        let multipleAppts;
        beforeEach(async () => {
          multipleAppts = await Appointment.bulkCreate([
            makeApptData({
              patientId: patients[0].id,
              ...dates(2017, 7, 5, 8),
            }),
          ]);
        });

        test('should return ONE appt at 8am appt', async () => {
          const startDate = date(2017, 7, 5, 9, 15);
          const endDate = date(2017, 7, 5, 9, 45);
          const outbox = await generateReviewsOutbox({ account, startDate, endDate });
          expect(outbox.length).toBe(1);
        });
      });

      describe('Missing Info', () => {
        let updatedPatients = [];
        beforeEach(async () => {
          updatedPatients[0] = await patients[0].update({ mobilePhoneNumber: null });
          updatedPatients[1] = await patients[1].update({ email: null });
          updatedPatients[2] = await patients[2].update({ mobilePhoneNumber: null });
          updatedPatients[3] = await patients[3].update({ mobilePhoneNumber: null, email: null });
        });

        test('should return the all appts for the day, default endDate', async () => {
          const startDate = date(2017, 7, 5, 7);
          const outbox = await generateReviewsOutbox({ account, startDate });
          expect(outbox.length).toBe(3);

          const sendDates = outbox.map(o => o.sendDate);
          expect(sendDates).toEqual([
            date(2017, 7, 5, 9, 15),
            date(2017, 7, 5, 10, 15),
            date(2017, 7, 5, 11, 15),
          ]);

          const primaryTypes = outbox.map(o => o.primaryTypes);
          expect(primaryTypes).toEqual([
            ['email'],
            ['sms'],
            ['email'],
          ]);
        });
      });
    });
  });
});
