
import { v4 as uuid } from 'uuid';
import * as RecallsLibrary from '../../../../server/lib/recalls';
import * as RecallsHelpers from '../../../../server/lib/recalls/helpers';
import sendRecall from '../../../../server/lib/recalls/sendRecall';
import { Account } from '../../../../server/_models';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../util/seedTestPatients';
import { seedTestRecalls, recallId1, recallId2 } from '../../../util/seedTestRecalls';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';

// Necessary for mocking
const sendRecallsForAccountTmp = RecallsLibrary.sendRecallsForAccount;
const sendRecallEmailTmp = sendRecall.email;
const getPatientsDueForRecallTmp = RecallsHelpers.getPatientsDueForRecall;

const mockPub = {
  publish: () => {},
};

const iso = (date = (new Date())) => date.toISOString();
const makeRecallData = (data = {}) => Object.assign({},
  {
    id: recallId1,
    accountId,
    primaryType: 'email',

    // 6 months by default
    lengthSeconds: 15552000,
  },
  data,
);

// const start = Date.now();

describe('Recalls Job Integration Tests', () => {
  // TODO: mock the sendRecall function, and test that it has been called for the appropriate patients
  beforeAll(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
    await seedTestRecalls();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('computeRemindersAndSend', () => {
    beforeEach(async () => {
      RecallsLibrary.sendRecallsForAccount = jest.fn(() => console.log('Calling sendRecallsForAccount Mock'));

      await Account.update({ canSendRecalls: false }, { where: {} });
    });

    afterAll(async () => {
      RecallsLibrary.sendRecallsForAccount = sendRecallsForAccountTmp;
    });

    /**
     * There is 1 account that has canSendRecalls=false,
     * therefore, sendRecallsForAccount should not be called
     */
    test('should NOT call sendRecallsForAccount if all turned off', async () => {
      await RecallsLibrary.computeRecallsAndSend({ date: '2015-08-27T00:00:00.000Z' });
      expect(RecallsLibrary.sendRecallsForAccount).not.toHaveBeenCalled();
    });

    /**
     * There is 1 account that has canSendRecalls=false,
     * but we update it to true,
     * the account's timezone is Vancouver and the time is 5pm given
     * the job will run between 5pm - 8pm vancouver time
     * therefore, sendRecallsForAccount should be called
     */
    test('  should call sendRecallsForAccount if 5pm', async () => {
      const account = await Account.findById(accountId);
      await account.update({ canSendRecalls: true });

      await RecallsLibrary.computeRecallsAndSend({ date: '2015-08-27T00:00:00.000Z' });
      expect(RecallsLibrary.sendRecallsForAccount).toHaveBeenCalledTimes(1);
    });

    /**
     * There is 1 account that has canSendRecalls=false,
     * but we update it to true,
     * the account's timezone is Vancouver and the time is 6pm given
     * the job will run between 5pm - 8pm vancouver time
     * therefore, sendRecallsForAccount should be called
     */
    test('should call sendRecallsForAccount if 6pm', async () => {
      const account = await Account.findById(accountId);
      await account.update({ canSendRecalls: true });

      await RecallsLibrary.computeRecallsAndSend({ date: '2015-08-27T01:00:00.000Z' });
      expect(RecallsLibrary.sendRecallsForAccount).toHaveBeenCalledTimes(1);
    });

    /**
     * There is 1 account that has canSendRecalls=false,
     * but we update it to true,
     * the account's timezone is Vancouver and the time is 8pm given
     * the job will run between 5pm - 8pm vancouver time
     * therefore, sendRecallsForAccount should be called
     */
    test('should call sendRecallsForAccount if 8pm', async () => {
      const account = await Account.findById(accountId);
      await account.update({ canSendRecalls: true });

      await RecallsLibrary.computeRecallsAndSend({ date: '2015-08-27T03:00:00.000Z' });
      expect(RecallsLibrary.sendRecallsForAccount).toHaveBeenCalledTimes(1);
    });

    /**
     * There is 1 account that has canSendRecalls=false,
     * but we update it to true,
     * the account's timezone is Vancouver and the time is 8:01pm given
     * the job will run between 5pm - 8pm vancouver time
     * therefore, sendRecallsForAccount should not be called
     */
    test('should not call sendRecallsForAccount if after 8pm', async () => {
      const account = await Account.findById(accountId);
      await account.update({ canSendRecalls: true });

      await RecallsLibrary.computeRecallsAndSend({ date: '2015-08-27T03:01:00.000Z' });
      expect(RecallsLibrary.sendRecallsForAccount).not.toHaveBeenCalled();
    });

    /**
     * There is 1 account that has canSendRecalls=false,
     * but we update it to true,
     * the account's timezone is Vancouver and the time is 4:59pm given
     * the job will run between 5pm - 8pm vancouver time
     * therefore, sendRecallsForAccount should not be called
     */
    test('should not call sendRecallsForAccount if before 5pm', async () => {
      const account = await Account.findById(accountId);
      await account.update({ canSendRecalls: true });

      await RecallsLibrary.computeRecallsAndSend({ date: '2015-08-26T23:59:00.000Z' });
      expect(RecallsLibrary.sendRecallsForAccount).not.toHaveBeenCalled();
    });
  });

  describe('sendRecallsForAccount', () => {
    let account;
    beforeEach(async () => {
      // Make it return empty array by default
      RecallsHelpers.getPatientsDueForRecall = jest.fn(() => []);
      sendRecall.email = jest.fn(() => console.log('Mock sendRecall.email called'));

      account = await Account.findById(accountId);
      // TODO: also need to add recalls onto the account?
    });

    afterAll(async () => {
      RecallsHelpers.getPatientsDueForRecall = getPatientsDueForRecallTmp;
      sendRecall.email = sendRecallEmailTmp;
    });

    /**
     * With 1 recall, and 1 patient, it should call sendRecall.email
     */
    test.skip('should call sendRecall.email for the 1 patient', async () => {
      // Make sure it returns a patient
      RecallsHelpers.getPatientsDueForRecall = jest.fn(() => [
        {
          id: patientId,
          email: 'justin+test@carecru.com',
          appointments: [{
            id: uuid(),
            startDate: iso(),
            endDate: iso(),
          }],
        },
      ]);

      account.recalls = [makeRecallData()];

      await RecallsLibrary.sendRecallsForAccount(account, iso(), mockPub);
      expect(RecallsHelpers.getPatientsDueForRecall).toHaveBeenCalledTimes(1);
      expect(sendRecall.email).toHaveBeenCalledTimes(1);
    });

    /**
     * With 1 recall, and 1 patient without an email, it should NOT call sendRecall.email
     */
    test.skip('should NOT call sendRecall.email for the 1 patient cause it has no email', async () => {
      // Make sure it returns a patient
      RecallsHelpers.getPatientsDueForRecall = jest.fn(() => [
        {
          id: patientId,
          appointments: [{
            id: uuid(),
            startDate: iso(),
            endDate: iso(),
          }],
        },
      ]);

      account.recalls = [makeRecallData()];

      await RecallsLibrary.sendRecallsForAccount(account, iso());
      expect(RecallsHelpers.getPatientsDueForRecall).toHaveBeenCalledTimes(1);
      expect(sendRecall.email).not.toHaveBeenCalled();
    });
  });
});
