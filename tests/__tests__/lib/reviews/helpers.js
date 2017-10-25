
/**
 * MAJOR DISCLAIMER: this assumes the DB is seeded with seeds!
 */

import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
  Account,
  Appointment,
  Patient,
  Practitioner,
  SentReview,
  Review,
} from '../../../../server/_models';
import {
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

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();
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
      beforeEach(async () => {
        account = await Account.findById(accountId);
        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 7, 5, 8) }), // Aug 5th at 8
          makeApptData({ ...dates(2017, 7, 6, 10) }), // Aug 6th at 10
          makeApptData({ id: appointmentId, ...dates(2017, 8, 8, 10) }), // Sept. 8th at 10
          makeApptData({ ...dates(2017, 8, 9, 10) }), // Sept. 9th at 10
        ]);
      });

      test('should return 1 appointment that needs a review email', async () => {
        const currentDate = date(2017, 8, 9, 7); // Sept. 9th 7am
        const appts = await getReviewAppointments({ account, date: currentDate });
        expect(appts.length).toBe(1);
        expect(appts[0].id).toBe(appointments[2].id);
      });

      test('should return 0 appointments because 1 already has a SentReview', async () => {
        const currentDate = date(2017, 8, 9, 7); // Sept. 9th 7am

        // has same appointmentId as one returned
        await SentReview.create(makeSentReviewData());
        const appts = await getReviewAppointments({ account, date: currentDate });
        expect(appts.length).toBe(0);
      });

      test('should return 0 appointments because patient has reviewed already', async () => {
        const currentDate = date(2017, 8, 9, 7); // Sept. 9th 7am

        // make review for patient
        await Review.create(makeReviewData());
        const appts = await getReviewAppointments({ account, date: currentDate });
        expect(appts.length).toBe(0);
      });

      // TODO: test that appts are not returned for patients that have had a sentReview in last week
      // TODO: test that appts are not returned for duplicate patients (say 2 appointments in last week)
    });
  });
});

