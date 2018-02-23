
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import {
  Account,
  Appointment,
  Patient,
  Practitioner,
  SentReview,
  Review,
} from '../../../../server/_models';
import {
  getEarliestLatestAppointment,
  getReviewAppointments,
} from '../../../../server/lib/reviews/helpers';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';

// TODO: make seeds more modular so we can see here
// const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
// const patientId = '3aeab035-b72c-4f7a-ad73-09465cbf5654';
const oneDayReminderId = '8aeab035-b72c-4f7a-ad73-09465cbf5654';
const appointmentId = uuid();

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
}, data);

const makeSentReviewData = (data = {}) => Object.assign({
  patientId,
  appointmentId,
  accountId,
}, data);

const makeReviewData = (data = {}) => Object.assign({
  patientId,
  accountId,
  stars: 3,
}, data);

const date = (y, m, d, h, mi = 0) => (new Date(y, m, d, h, mi)).toISOString();
const dates = (y, m, d, h) => {
  return {
    startDate: date(y, m, d, h),
    endDate: date(y, m, d, h + 1),
  };
};

describe('Reviews Calculation Library', () => {
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
    describe('#getReviewAppointments', () => {
      test('should be a function', () => {
        expect(typeof getReviewAppointments).toBe('function');
      });

      let account;
      let appointments;
      let patients;
      beforeEach(async () => {
        account = await Account.findById(accountId);
        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'Dustin', lastName: 'Dharp' }),
          makePatientData({ firstName: 'Frank', lastName: 'Abagnale' }),
          makePatientData({ firstName: 'Ethan', lastName: 'Hunt' }),
          makePatientData({ firstName: 'Donald', lastName: 'Trump' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 7, 5, 8), patientId: patients[0].id }), // Aug 5th at 8am - Dustin
          makeApptData({ ...dates(2017, 7, 5, 9), patientId: patients[1].id }), // Aug 5th at 9am - Frank
          makeApptData({ ...dates(2017, 7, 5, 10), patientId: patients[2].id }), // Aug 5th at 10am - Ethan
          makeApptData({ ...dates(2017, 7, 5, 10), patientId: patients[3].id }), // Aug 5th at 9am - Donald
        ]);
      });

      describe('Basic Tests, default endDate', () => {
        test('should return the 1 appt for Dustin', async () => {
          const startDate = date(2017, 7, 5, 11);
          const appts = await getReviewAppointments({ account, startDate });
          expect(appts.length).toBe(1);
          expect(appts[0].patientId).toBe(patients[0].id);
        });

        test('should return the 0 appts cause no endDate in the range', async () => {
          const startDate = date(2017, 7, 5, 10);
          const appts = await getReviewAppointments({ account, startDate });
          expect(appts.length).toBe(0);
        });

        test('should return the 2 10am appts for Ethan and Donald', async () => {
          const startDate = date(2017, 7, 5, 13);
          const appts = await getReviewAppointments({ account, startDate });
          expect(appts.length).toBe(2);

          const patientIds = appts.map(a => a.patientId);
          expect(patientIds).toContain(patients[2].id);
          expect(patientIds).toContain(patients[3].id);
        });

        test('should return 1 9am appt for Frank', async () => {
          const startDate = date(2017, 7, 5, 12);
          const appts = await getReviewAppointments({ account, startDate });
          expect(appts.length).toBe(1);
          expect(appts[0].patientId).toBe(patients[1].id);
        });
      });

      describe('Multiple Appts Tests, default endDate', () => {
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
          const startDate = date(2017, 7, 5, 11);
          const appts = await getReviewAppointments({ account, startDate });
          expect(appts.length).toBe(0);
        });

        test('should return the 9am appt because its the latest one Dustin has', async () => {
          const startDate = date(2017, 7, 5, 11, 30);
          const appts = await getReviewAppointments({ account, startDate });
          expect(appts.length).toBe(1);
          expect(appts[0].patientId).toBe(patients[0].id);
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
          const startDate = date(2017, 7, 5, 11);
          const appts = await getReviewAppointments({ account, startDate });
          expect(appts.length).toBe(1);
        });
      });

      describe('Larger Date Range', () => {
        let futureAppts;
        beforeEach(async () => {
          futureAppts = await Appointment.bulkCreate([
            // Same day appt for Dustin
            makeApptData({
              patientId: patients[0].id,
              startDate: date(2017, 7, 5, 9),
              endDate: date(2017, 7, 5, 9, 30),
            }),

            // Appt in 2 days for Dustin
            makeApptData({
              patientId: patients[0].id,
              ...dates(2017, 7, 7, 8),
            }),

            // Same day appt in 2 days for Dustin
            makeApptData({
              patientId: patients[0].id,
              startDate: date(2017, 7, 7, 9),
              endDate: date(2017, 7, 7, 9, 30),
            }),
          ]);
        });

        test('should return 4 appts, ignoring Dustin\'s same day and future appts', async () => {
          const startDate = date(2017, 7, 5, 8);
          const endDate = date(2017, 7, 7, 12);
          const appts = await getReviewAppointments({ account, startDate, endDate });
          expect(appts.length).toBe(4);

          // Order is a little complicated cause of the groupBy
          expect(appts[0].patientId).toBe(patients[0].id); // Dustin
          expect(appts[3].patientId).toBe(patients[1].id); // Frank
        });
      });

      describe('Involving SentReviews and Reviews', () => {
        let reviews;
        let sentReviews;
        let olderAppt;
        beforeEach(async () => {
          olderAppt = await Appointment.create(makeApptData({
            patientId: patients[0].id,
            ...dates(2017, 7, 5, 12),
          }));

          sentReviews = await SentReview.bulkCreate([
            makeSentReviewData({
              isSent: true,
              appointmentId: olderAppt.id,
              patientId: patients[0].id,
              createdAt: date(2017, 7, 5, 16),
            }),
          ]);

          reviews = await Review.bulkCreate([
            makeReviewData({ patientId: patients[2].id }),
          ]);
        });

        test('should not return appt for Dustin cause he has already sentReview', async () => {
          const startDate = date(2017, 7, 5, 11);
          const appts = await getReviewAppointments({ account, startDate });
          expect(appts.length).toBe(0);
        });

        test('should return the 1 10am appt for Frank because Ethan already left a review', async () => {
          const startDate = date(2017, 7, 5, 13);
          const appts = await getReviewAppointments({ account, startDate });
          expect(appts.length).toBe(1);
          expect(appts[0].patientId).toBe(patients[3].id);
        });
      });
    });

    describe('#getEarliestLatestAppointment', () => {
      test('should be a function', () => {
        expect(typeof getEarliestLatestAppointment).toBe('function');
      });

      test('should return latest appointment on the 7th', () => {
        const appointments = [
          { id: 3, patientId: 0, ...dates(2017, 7, 9, 9) },
          { id: 2, patientId: 0, ...dates(2017, 7, 7, 17) },
          { id: 1, patientId: 0, ...dates(2017, 7, 7, 10) },
          { id: 0, patientId: 0, ...dates(2017, 7, 7, 9) },
        ];

        const filtered = getEarliestLatestAppointment({ appointments, account: { timezone: 'America/Vancouver' } });
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(2);
      });

      test('should return latest appointment on the 7th', () => {
        const appointments = [
          { id: 4, patientId: 0, ...dates(2017, 7, 9, 9) },
          { id: 3, patientId: 1, ...dates(2017, 7, 9, 8) },
          { id: 2, patientId: 0, ...dates(2017, 7, 7, 17) },
          { id: 1, patientId: 0, ...dates(2017, 7, 7, 10) },
          { id: 0, patientId: 0, ...dates(2017, 7, 7, 9) },
        ];

        const filtered = getEarliestLatestAppointment({ appointments, account: { timezone: 'America/Vancouver' } });
        expect(filtered.length).toBe(2);
        expect(filtered[0].id).toBe(2);
        expect(filtered[1].id).toBe(3);
      });
    });
  });
});
