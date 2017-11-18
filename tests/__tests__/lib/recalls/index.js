
import { v4 as uuid } from 'uuid';
import * as RecallsLibrary from '../../../../server/lib/recalls';
import * as RecallsHelpers from '../../../../server/lib/recalls/helpers';
import sendRecall from '../../../../server/lib/recalls/sendRecall';
import { Account } from '../../../../server/_models';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../_util/seedTestPatients';
import { seedTestRecalls, recallId1, recallId2 } from '../../../_util/seedTestRecalls';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';

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
      await RecallsLibrary.computeRecallsAndSend({ date: (new Date()).toISOString() });
      expect(RecallsLibrary.sendRecallsForAccount).not.toHaveBeenCalled();
    });

    /**
     * There is 1 account that has canSendRecalls=false,
     * but we update it to true,
     * therefore, sendRecallsForAccount should be called
     */
    test('should call sendRecallsForAccount if 1 turned on', async () => {
      const account = await Account.findById(accountId);
      await account.update({ canSendRecalls: true });

      await RecallsLibrary.computeRecallsAndSend({ date: (new Date()).toISOString() });
      expect(RecallsLibrary.sendRecallsForAccount).toHaveBeenCalledTimes(1);
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
     * Without any recalls, there is no need to getPatientDueForRecall
     */
    test('should NOT call getPatientsDueForRecall if no recalls to process', async () => {
      account.recalls = [];
      await RecallsLibrary.sendRecallsForAccount(account, iso());
      expect(RecallsHelpers.getPatientsDueForRecall).not.toHaveBeenCalled();
    });

    /**
     * With 1 recall, it should call getPatientsDueForRecall, but not call sendRecall.email
     */
    test('should call getPatientsDueForRecall if there is a recall, but because it returns [], will not call sendRecall.email', async () => {
      account.recalls = [makeRecallData()];
      await RecallsLibrary.sendRecallsForAccount(account, iso());
      expect(RecallsHelpers.getPatientsDueForRecall).toHaveBeenCalledTimes(1);
      expect(sendRecall.email).not.toHaveBeenCalled();
    });

    /**
     * With 1 recall, and 1 patient, it should call sendRecall.email
     */
    test('should call sendRecall.email for the 1 patient', async () => {
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
    test('should NOT call sendRecall.email for the 1 patient cause it has no email', async () => {
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
