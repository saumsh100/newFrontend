
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import * as RemindersLibrary from '../../../../server/lib/reminders';
import * as RemindersHelpers from '../../../../server/lib/reminders/helpers';
import sendReminder from '../../../../server/lib/reminders/sendReminder';
import {
  Account,
  Address,
  Appointment,
  Enterprise,
  Reminder,
  Patient,
  Practitioner,
} from '../../../../server/_models';
import { tzIso } from '../../../../server/util/time';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId, enterpriseId } from '../../../util/seedTestUsers';
import { patientId } from '../../../util/seedTestPatients';
import { seedTestAppointments, appointmentId } from '../../../util/seedTestAppointments';
import { seedTestReminders, reminderId1, reminderId2 } from '../../../util/seedTestReminders';

// Necessary for mocking
const sendRemindersForAccountTmp = RemindersLibrary.sendRemindersForAccount;
const sendReminderEmailTmp = sendReminder.email;
const sendReminderSmsTmp = sendReminder.sms;
const sendReminderPhoneTmp = sendReminder.phone;
const getAppointmentsFromReminderTmp = RemindersHelpers.getAppointmentsFromReminder;

const mockPub = {
  publish: () => {},
};

const TIME_ZONE = 'America/Vancouver';
const td = d => tzIso(d, TIME_ZONE);
const iso = (date = (new Date())) => date.toISOString();
const makeReminderData = (data = {}) => Object.assign(
  {},
  {
    id: reminderId1,
    accountId,
    primaryTypes: ['sms'],
    interval: '2 hours',
  },
  data,
);

const dates = () => ({ startDate: td('2017-01-05 11:00'), endDate: td('2017-01-05 11:05') });

describe('Reminders Job Integration Tests', () => {
  // TODO: mock the sendRecall function, and test that it has been called for the appropriate patients
  beforeEach(async () => {
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
      await RemindersLibrary.computeRemindersAndSend({ ...dates() });
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
      await RemindersLibrary.computeRemindersAndSend({ ...dates() });
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
      await RemindersLibrary.sendRemindersForAccount({ account, pub: mockPub, ...dates() });
      expect(RemindersHelpers.getAppointmentsFromReminder).not.toHaveBeenCalled();
    });

    /**
     * With 1 reminder, it should call getAppointmentsFromReminder, but not call sendReminder.sms
     */
    test('should call getAppointmentsFromReminder if there is a reminder, but because it returns [], will not call sendReminder', async () => {
      account.reminders = [makeReminderData()];
      await RemindersLibrary.sendRemindersForAccount({ account, pub: mockPub, ...dates() });
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
          startDate: td(),
          endDate: td(),
          get() {
            return {
              id: appointmentId,
              startDate: td(),
              endDate: td(),
              update() {
                console.log('Appointment is being updated!');
              },
            };
          },

          patient: {
            id: patientId,
            mobilePhoneNumber: '+16042433796',
            get() {
              return {
                id: patientId,
                mobilePhoneNumber: '+16042433796',
              };
            }
          },

          update() {
            console.log('Appointment is being updated!');
          },
        },
      ]);

      account.reminders = [makeReminderData()];

      await RemindersLibrary.sendRemindersForAccount({ account, pub: mockPub, ...dates() });
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
          startDate: td(),
          endDate: td(),
          get() {
            return {
              id: appointmentId,
              startDate: td(),
              endDate: td(),
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

          update() {
            console.log('Appointment is being updated!');
          },
        },
      ]);

      account.reminders = [makeReminderData()];

      await RemindersLibrary.sendRemindersForAccount({ account, pub: mockPub, ...dates() });
      expect(RemindersHelpers.getAppointmentsFromReminder).toHaveBeenCalledTimes(1);
      expect(sendReminder.sms).not.toHaveBeenCalled();
    });
  });

  describe('getRemindersOutboxList', () => {
    const newAddressId = 'cd39f7d8-fc06-11e7-8450-fea9aa178066';
    const newAccountId = '2fc72afc-fc06-11e7-8450-fea9aa178066';

    let account;
    let practitioner;
    let reminders;
    let patients;
    let appointments;
    beforeEach(async () => {
      await Address.create({ id: newAddressId });
      account = await Account.create({
        id: newAccountId,
        name: 'New Account',
        enterpriseId,
        addressId: newAddressId,
        timezone: TIME_ZONE,
      });

      practitioner = await Practitioner.create({
        accountId: newAccountId,
        firstName: 'Timothy',
      });

      reminders = await Reminder.bulkCreate([
        {
          accountId: newAccountId,
          primaryTypes: ['sms'],
          interval: '2 hours'
        },
        {
          accountId: newAccountId,
          primaryTypes: ['email', 'sms'],
          interval: '2 days',
        },
        {
          accountId: newAccountId,
          primaryTypes: ['email', 'sms'],
          interval: '2 weeks',
        },
      ]);

      patients = await Patient.bulkCreate([
        {
          accountId: newAccountId,
          email: 'sarah@williams.ca',
          mobilePhoneNumber: '+12223334444',
          firstName: 'Sarah',
          lastName: 'Williams',
        },
        {
          accountId: newAccountId,
          email: 'john@doe.ca',
          mobilePhoneNumber: '+13334445555',
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          accountId: newAccountId,
          email: 'jane@donut.ca',
          mobilePhoneNumber: '+14445556666',
          firstName: 'Jane',
          lastName: 'Donut',
        },
        {
          accountId: newAccountId,
          mobilePhoneNumber: '+15556667777',
          firstName: 'Jack',
          lastName: 'Sharp',
        },
      ]);

      appointments = await Appointment.bulkCreate([
        {
          accountId: newAccountId,
          patientId: patients[0].id,
          practitionerId: practitioner.id,
          startDate: td('2018-01-17 11:00'), // Jan 17th @ 11:00 am
          endDate: td('2018-01-17 12:00'),
        },
        {
          accountId: newAccountId,
          patientId: patients[1].id,
          practitionerId: practitioner.id,
          startDate: td('2018-01-17 11:16'), // Jan 17th @ 11:16 am
          endDate: td('2018-01-17 12:16'),
        },
        {
          accountId: newAccountId,
          patientId: patients[2].id,
          practitionerId: practitioner.id,
          startDate: td('2018-01-19 09:00'), // Jan 19th @ 9:00 am
          endDate: td('2018-01-19 10:00'),
        },
        {
          accountId: newAccountId,
          patientId: patients[3].id,
          practitionerId: practitioner.id,
          startDate: td('2018-01-31 10:15'), // Jan 31st @ 10:15 am
          endDate: td('2018-01-31 11:15'),
        },
      ]);
    });

    afterAll(async () => {
      await wipeAllModels();
    });


    test('it should be a function', () => {
      expect(typeof RemindersLibrary.getRemindersOutboxList).toBe('function');
    });

    test('it should return 2 list items for a daterange of 9:00 to 9:05', async () => {
      const startDate = td('2018-01-17 09:00');
      const endDate = td('2018-01-17 09:05');
      const outboxList = await RemindersLibrary.getRemindersOutboxList({ account, startDate, endDate });

      expect(outboxList.length).toBe(2);
      expect(outboxList[0].primaryTypes).toEqual(['sms']);
      expect(outboxList[1].primaryTypes).toEqual(['email', 'sms']);
    });

    test('it should return 2 list items for a daterange of 9:00 to 10:15', async () => {
      const startDate = td('2018-01-17 09:00');
      const endDate = td('2018-01-17 10:15');
      const outboxList = await RemindersLibrary.getRemindersOutboxList({ account, startDate, endDate });

      expect(outboxList.length).toBe(3);
      expect(outboxList[0].primaryTypes).toEqual(['sms']);
      expect(outboxList[1].primaryTypes).toEqual(['email', 'sms']);
      expect(outboxList[2].primaryTypes).toEqual(['sms']);

      expect(moment.tz(outboxList[0].sendDate, TIME_ZONE).format('h:mma')).toBe('9:00am');
      expect(moment.tz(outboxList[1].sendDate, TIME_ZONE).format('h:mma')).toBe('9:00am');
      expect(moment.tz(outboxList[2].sendDate, TIME_ZONE).format('h:mma')).toBe('9:15am');
    });
  });

  describe('getRemindersOutboxList - isDaily', () => {
    const newAddressId = 'cd39f7d8-fc06-11e7-8450-fea9aa178066';
    const newAccountId = '2fc72afc-fc06-11e7-8450-fea9aa178066';

    let account;
    let practitioner;
    let reminders;
    let patients;
    let appointments;
    beforeEach(async () => {
      await Address.create({ id: newAddressId });

      account = await Account.create({
        id: newAccountId,
        name: 'New Account',
        enterpriseId,
        addressId: newAddressId,
        timezone: 'America/Vancouver',
      });

      practitioner = await Practitioner.create({
        accountId: newAccountId,
        firstName: 'Timothy',
      });

      reminders = await Reminder.bulkCreate([
        {
          accountId: newAccountId,
          primaryTypes: ['sms'],
          interval: '2 hours'
        },
        {
          accountId: newAccountId,
          primaryTypes: ['email', 'sms'],
          interval: '2 days',
          isDaily: true,
          dailyRunTime: '11:00:00'
        },
      ]);

      patients = await Patient.bulkCreate([
        {
          accountId: newAccountId,
          email: 'sarah@williams.ca',
          mobilePhoneNumber: '+12223334444',
          firstName: 'Sarah',
          lastName: 'Williams',
        },
        {
          accountId: newAccountId,
          email: 'john@doe.ca',
          mobilePhoneNumber: '+13334445555',
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          accountId: newAccountId,
          email: 'jane@donut.ca',
          mobilePhoneNumber: '+14445556666',
          firstName: 'Jane',
          lastName: 'Donut',
        },
        {
          accountId: newAccountId,
          mobilePhoneNumber: '+15556667777',
          firstName: 'Jack',
          lastName: 'Sharp',
        },
      ]);

      appointments = await Appointment.bulkCreate([
        {
          accountId: newAccountId,
          patientId: patients[0].id,
          practitionerId: practitioner.id,

          startDate: td('2018-01-17 11:00'), // Jan 17th @ 11:00 am
          endDate: td('2018-01-17 12:00'),
        },
        {
          accountId: newAccountId,
          patientId: patients[1].id,
          practitionerId: practitioner.id,
          startDate: td('2018-01-17 11:16'), // Jan 17th @ 11:16 am
          endDate: td('2018-01-17 12:16'),
        },
        {
          accountId: newAccountId,
          patientId: patients[2].id,
          practitionerId: practitioner.id,
          startDate: td('2018-01-19 09:00'), // Jan 19th @ 9:00 am
          endDate: td('2018-01-19 10:00'),
        },
      ]);
    });

    test('it should be a function', () => {
      expect(typeof RemindersLibrary.getRemindersOutboxList).toBe('function');
    });

    test('it should return 2 list items for a daterange of 9:00 to 9:05', async () => {
      const startDate = td('2018-01-17 09:00'); // Jan 17th 9am
      const endDate = td('2018-01-17 09:05');
      const outboxList = await RemindersLibrary.getRemindersOutboxList({ account, startDate, endDate });

      expect(outboxList.length).toBe(1);
      expect(outboxList[0].primaryTypes).toEqual(['sms']);
      expect(moment.tz(outboxList[0].sendDate, TIME_ZONE).format('h:mma')).toBe('9:00am');
    });

    test('it should return 2 list items for a daterange of 9:00 to 11:00', async () => {
      const startDate = td('2018-01-17 09:00');
      const endDate = td('2018-01-17 11:00');
      const outboxList = await RemindersLibrary.getRemindersOutboxList({ account, startDate, endDate });

      expect(outboxList.length).toBe(2);
      expect(outboxList[0].primaryTypes).toEqual(['sms']);
      expect(outboxList[1].primaryTypes).toEqual(['sms']);

      expect(moment.tz(outboxList[0].sendDate, TIME_ZONE).format('h:mma')).toBe('9:00am');
      expect(moment.tz(outboxList[1].sendDate, TIME_ZONE).format('h:mma')).toBe('9:15am');
    });

    test('it should return 3 list items for a daterange of 9:00 to 11:01', async () => {
      const startDate = td('2018-01-17 09:00');
      const endDate = td('2018-01-17 11:01');
      const outboxList = await RemindersLibrary.getRemindersOutboxList({ account, startDate, endDate });

      expect(outboxList.length).toBe(3);
      expect(outboxList[0].primaryTypes).toEqual(['sms']);
      expect(outboxList[1].primaryTypes).toEqual(['sms']);
      expect(outboxList[2].primaryTypes).toEqual(['email', 'sms']);

      expect(moment.tz(outboxList[0].sendDate, TIME_ZONE).format('h:mma')).toBe('9:00am');
      expect(moment.tz(outboxList[1].sendDate, TIME_ZONE).format('h:mma')).toBe('9:15am');
      expect(moment.tz(outboxList[2].sendDate, TIME_ZONE).format('h:mma')).toBe('11:00am');
    });
  });
});
