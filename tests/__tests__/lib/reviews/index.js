
import { v4 as uuid } from 'uuid';
import * as ReviewsLibrary from '../../../../server/lib/reviews';
import * as ReviewsHelpers from '../../../../server/lib/reviews/helpers';
import sendReview from '../../../../server/lib/reviews/sendReview';
import { Account } from '../../../../server/_models';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { patientId } from '../../../util/seedTestPatients';
import { seedTestAppointments, appointmentId } from '../../../util/seedTestAppointments';

// Necessary for mocking
const sendReviewsForAccountTmp = ReviewsLibrary.sendReviewsForAccount;
const sendReviewEmailTmp = sendReview.email;
const getReviewAppointments = ReviewsHelpers.getReviewAppointments;

const iso = (date = (new Date())) => date.toISOString();

// const start = Date.now();

describe('Reviews Job Integration Tests', () => {
  // TODO: mock the sendRecall function, and test that it has been called for the appropriate patients
  beforeAll(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestAppointments();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('computeReviewsAndSend', () => {
    beforeEach(async () => {
      ReviewsLibrary.sendReviewsForAccount = jest.fn(() => console.log('Calling sendReviewsForAccount Mock'));

      await Account.update({ canSendReviews: false }, { where: {} });
    });

    afterAll(async () => {
      ReviewsLibrary.sendReviewsForAccount = sendReviewsForAccountTmp;
    });

    /**
     * There is 1 account that has canSendReviews=false,
     * therefore, sendReviewsForAccount should not be called
     */
    test('should NOT call sendReviewsForAccount if all turned off', async () => {
      await ReviewsLibrary.computeReviewsAndSend({ date: (new Date()).toISOString() });
      expect(ReviewsLibrary.sendReviewsForAccount).not.toHaveBeenCalled();
    });

    /**
     * There is 1 account that has canSendReviews=false,
     * but we update it to true,
     * therefore, sendReviewsForAccount should be called
     */
    test('should call sendReviewsForAccount if 1 turned on', async () => {
      const account = await Account.findById(accountId);
      await account.update({ canSendReviews: true });

      await ReviewsLibrary.computeReviewsAndSend({ date: (new Date()).toISOString() });
      expect(ReviewsLibrary.sendReviewsForAccount).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendReviewsForAccount', () => {
    let account;
    beforeEach(async () => {
      // Make it return empty array by default
      ReviewsHelpers.getReviewAppointments = jest.fn(() => []);
      sendReview.email = jest.fn(() => console.log('Mock sendReview.email called'));

      account = await Account.findById(accountId);
    });

    afterAll(async () => {
      ReviewsHelpers.getReviewAppointments = getReviewAppointments;
      sendReview.email = sendReviewEmailTmp;
    });

    /**
     * With 1 recall, it should call getPatientsDueForRecall, but not call sendRecall.email
     */
    test('should call getReviewAppointments', async () => {
      await ReviewsLibrary.sendReviewsForAccount(account, iso());
      expect(ReviewsHelpers.getReviewAppointments).toHaveBeenCalledTimes(1);
      expect(sendReview.email).not.toHaveBeenCalled();
    });

    /**
     * With 1 recall, and 1 patient, it should call sendRecall.email
     */
    test.skip('should call sendReview.email for the 1 patient', async () => {
      // Make sure it returns a patient
      ReviewsHelpers.getReviewAppointments = jest.fn(() => [
        {
          id: appointmentId,
          startDate: iso(),
          endDate: iso(),
          get() {
            return {
              id: appointmentId,
              startDate: iso(),
              endDate: iso(),
            };
          },

          patient: {
            id: patientId,
            email: 'justin+test@carecru.com',
            get() {
              return {
                id: patientId,
                email: 'justin+test@carecru.com',
              };
            }
          },
        },
      ]);

      await ReviewsLibrary.sendReviewsForAccount(account, iso());
      expect(ReviewsHelpers.getReviewAppointments).toHaveBeenCalledTimes(1);
      expect(sendReview.email).toHaveBeenCalledTimes(1);
    });

    /**
     * With 1 recall, and 1 patient without an email, it should NOT call sendRecall.email
     */
    test.skip('should NOT call sendRecall.email for the 1 patient cause it has no email', async () => {
      // Make sure it returns a patient
      ReviewsHelpers.getReviewAppointments = jest.fn(() => [
        {
          id: appointmentId,
          startDate: iso(),
          endDate: iso(),
          get() {
            return {
              id: appointmentId,
              startDate: iso(),
              endDate: iso(),
            };
          },

          patient: {
            id: patientId,
            get() {
              return {
                id: patientId,
              };
            }
          },
        },
      ]);

      await ReviewsLibrary.sendReviewsForAccount(account, iso());
      expect(ReviewsHelpers.getReviewAppointments).toHaveBeenCalledTimes(1);
      expect(sendReview.email).not.toHaveBeenCalled();
    });
  });
});
