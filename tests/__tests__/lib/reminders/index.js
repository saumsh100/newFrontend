
import { v4 as uuid } from 'uuid';
import * as RemindersLibrary from '../../../../server/lib/reminders';
import * as RemindersHelpers from '../../../../server/lib/reminders/helpers';
import sendReminder from '../../../../server/lib/reminders/sendReminder';
import { Account } from '../../../../server/_models';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../_util/seedTestPatients';
import { seedTestAppointments, appointmentId } from '../../../_util/seedTestAppointments';
import { seedTestReminders, reminderId1, reminderId2 } from '../../../_util/seedTestReminders';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';

// Necessary for mocking
const sendRemindersForAccountTmp = RemindersLibrary.sendRemindersForAccount;
const sendReminderEmailTmp = sendReminder.email;
const sendReminderSmsTmp = sendReminder.sms;
const sendReminderPhoneTmp = sendReminder.phone;
const getAppointmentsFromReminderTmp = RemindersHelpers.getAppointmentsFromReminder;

const iso = (date = (new Date())) => date.toISOString();
const makeReminderData = (data = {}) => Object.assign({},
  {
    id: reminderId1,
    accountId,
    primaryType: 'sms',

    // 2 hours by default
    lengthSeconds: 7200,
  },
  data,
);

// const start = Date.now();

describe('Reminders Job Integration Tests', () => {
  // TODO: mock the sendRecall function, and test that it has been called for the appropriate patients
  beforeAll(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestReminders();
    await seedTestAppointments();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('computeRemindersAndSend', () => {
    beforeEach(async () => {
      RemindersLibrary.sendRemindersForAccount = jest.fn(() => console.log('Calling sendRecallsForAccount Mock'));
      await Account.update({ canSendReminders: false }, { where: {} });
    });

    afterAll(async () => {
      RemindersLibrary.sendRemindersForAccount = sendRemindersForAccountTmp;
    });

    /**
     * There is 1 account that has canSendRecalls=false,
     * therefore, sendRecallsForAccount should not be called
     */
    test('should NOT call sendRemindersForAccount if all turned off', async () => {
      await RemindersLibrary.computeRemindersAndSend({ date: (new Date()).toISOString() });
      expect(RemindersLibrary.sendRemindersForAccount).not.toHaveBeenCalled();
    });

    /**
     * There is 1 account that has canSendRecalls=false,
     * but we update it to true,
     * therefore, sendRecallsForAccount should be called
     */
    test('should call sendRemindersForAccount if 1 turned on', async () => {
      const account = await Account.findById(accountId);
      await account.update({ canSendReminders: true });

      await RemindersLibrary.computeRemindersAndSend({ date: (new Date()).toISOString() });
      expect(RemindersLibrary.sendRemindersForAccount).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendRemindersForAccount', () => {
    let account;
    beforeEach(async () => {
      // Make it return empty array by default
      RemindersHelpers.getAppointmentsFromReminder = jest.fn(() => []);
      sendReminder.email = jest.fn(() => console.log('Mock sendReminder.email called'));
      sendReminder.sms = jest.fn(() => console.log('Mock sendReminder.sms called'));
      sendReminder.phone = jest.fn(() => console.log('Mock sendReminder.phone called'));

      account = await Account.findById(accountId);
      // TODO: also need to add recalls onto the account?
    });

    afterAll(async () => {
      RemindersHelpers.getAppointmentsFromReminder = getAppointmentsFromReminderTmp;
      sendReminder.email = sendReminderEmailTmp;
      sendReminder.sms = sendReminderSmsTmp;
      sendReminder.phone = sendReminderPhoneTmp;
    });

    /**
     * Without any reminders, there is no need to getAppointmentsFromReminder
     */
    test('should NOT call getAppointmentsFromReminder if no reminders to process', async () => {
      account.reminders = [];
      await RemindersLibrary.sendRemindersForAccount(account, iso());
      expect(RemindersHelpers.getAppointmentsFromReminder).not.toHaveBeenCalled();
    });

    /**
     * With 1 reminder, it should call getAppointmentsFromReminder, but not call sendReminder.sms
     */
    test('should call getAppointmentsFromReminder if there is a reminder, but because it returns [], will not call sendReminder', async () => {
      account.reminders = [makeReminderData()];
      await RemindersLibrary.sendRemindersForAccount(account, iso());
      expect(RemindersHelpers.getAppointmentsFromReminder).toHaveBeenCalledTimes(1);
      expect(sendReminder.sms).not.toHaveBeenCalled();
    });

    /**
     * With 1 reminder, and 1 patient, it should call sendReminder.sms
     */
    test('should call sendReminder.sms for the 1 patient', async () => {
      // Make sure it returns a patient
      RemindersHelpers.getAppointmentsFromReminder = jest.fn(() => [
        {
          id: appointmentId,
          startDate: iso(),
          endDate: iso(),
          patient: {
            id: patientId,
            mobilePhoneNumber: '+17808508886',
          },

          update() {
            console.log('Appointment is being updated!');
          }
        },
      ]);

      account.reminders = [makeReminderData()];

      await RemindersLibrary.sendRemindersForAccount(account, iso());
      expect(RemindersHelpers.getAppointmentsFromReminder).toHaveBeenCalledTimes(1);
      expect(sendReminder.sms).toHaveBeenCalledTimes(1);
    });

    /**
     * With 1 reminder, and 1 patient without a mobilePhoneNumber, it should NOT call sendReminder.sms
     */
    test('should NOT call sendReminder.sms for the 1 patient cause it has no mobilePhoneNumber', async () => {
      // Make sure it returns a patient
      RemindersLibrary.getAppointmentsFromReminder = jest.fn(() => [
        {
          id: appointmentId,
          startDate: iso(),
          endDate: iso(),
          patient: {
            id: patientId,
          },

          update() {
            console.log('Appointment is being updated!');
          }
        },
      ]);

      account.reminders = [makeReminderData()];

      await RemindersLibrary.sendRemindersForAccount(account, iso());
      expect(RemindersHelpers.getAppointmentsFromReminder).toHaveBeenCalledTimes(1);
      expect(sendReminder.sms).not.toHaveBeenCalled();
    });
  });
});
