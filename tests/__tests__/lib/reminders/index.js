
import moment from 'moment';
import {
  Account,
  Address,
  Appointment,
  Reminder,
  Patient,
  Practitioner,
  SentReminder,
  SentRemindersPatients
} from 'CareCruModels';
import sendReminder, { createConfirmationText } from '../../../../server/lib/reminders/sendReminder';
import * as RemindersLibrary from '../../../../server/lib/reminders';
import * as RemindersHelpers from '../../../../server/lib/reminders/helpers';
import { tzIso } from '../../../../server/util/time';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId, enterpriseId } from '../../../util/seedTestUsers';
import { patientId } from '../../../util/seedTestPatients';
import { seedTestAppointments, appointmentId } from '../../../util/seedTestAppointments';
import { seedTestReminders, reminderId1 } from '../../../util/seedTestReminders';
import * as ContactInfo from '../../../../server/lib/contactInfo/getPatientFromCellPhoneNumber';

// Necessary for mocking
let sendRemindersForAccountTmp = RemindersLibrary.sendRemindersForAccount;
let sendReminderEmailTmp = sendReminder.email;
let sendReminderSmsTmp = sendReminder.sms;
let sendReminderPhoneTmp = sendReminder.phone;
let getAppointmentsFromReminderTmp = RemindersHelpers.getAppointmentsFromReminder;
let fetchPatientsFromKeyValueTmp = ContactInfo.fetchPatientsFromKeyValue;

const mockPub = { publish: () => {} };

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

const patient = { firstName: 'John' };
const patient2 = { firstName: 'Jane' };
const account = {
  timezone: TIME_ZONE,
  name: 'Test account',
};
const appointment = { startDate: '2018-09-11 18:45:01.09+02' };
const appointment2 = { startDate: '2018-09-11 17:30:01.09+02' };
const reminder = { isCustomConfirm: false };

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

  describe('createConfirmationText', () => {
    test('should use patientConfirmationText if isFamily is false', () => {
      const resultText = createConfirmationText({
        patient,
        account,
        appointment,
        reminder,
        isFamily: false,
      });

      expect(resultText).toMatchSnapshot();
    });

    test('should use getFamilyConfirmationText if isFamily is true', () => {
      const sentRemindersPatients = [
        {
          patient: patient2,
          appointment: appointment2,
        },
      ];

      const resultText = createConfirmationText({
        patient,
        account,
        appointment,
        reminder,
        isFamily: true,
        sentRemindersPatients,
      });

      expect(resultText).toMatchSnapshot();
    });

    test('should use family appointment when family length > 1', () => {
      const sentRemindersPatients = [
        {
          patient,
          appointment,
        },
        {
          patient: patient2,
          appointment: appointment2,
        },
      ];

      const resultText = createConfirmationText({
        patient,
        account,
        appointment,
        reminder,
        isFamily: true,
        sentRemindersPatients,
      });

      expect(resultText).toMatchSnapshot();
    });

    test('sentReminder\'s appointment is used for family appointment', () => {
      const sentRemindersPatients = [
        {
          patient: patient2,
          appointment: appointment2,
        },
      ];

      const resultText = createConfirmationText({
        patient,
        account,
        appointment: {},
        reminder,
        isFamily: true,
        sentRemindersPatients,
      });

      expect(resultText).toMatchSnapshot();
    });
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
      ContactInfo.fetchPatientsFromKeyValue = jest.fn(() => []);

      account = await Account.findById(accountId);
      // TODO: also need to add recalls onto the account?
    });

    afterAll(async () => {
      RemindersHelpers.getAppointmentsFromReminder = getAppointmentsFromReminderTmp;
      sendReminder.email = sendReminderEmailTmp;
      sendReminder.sms = sendReminderSmsTmp;
      sendReminder.phone = sendReminderPhoneTmp;
      ContactInfo.fetchPatientsFromKeyValue = fetchPatientsFromKeyValueTmp;
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
      const createPatient = () => ({
        id: patientId,
        mobilePhoneNumber: '+16042433796',
        cellPhoneNumber: '+16042433796',
        pmsCreatedAt: new Date(2016, 1, 1),
        preferences: { sms: true },
        familyId: 'Jones',
        family: {
          id: 'Jones',
          pmsCreatedAt: new Date(2016, 1, 1),
          headId: patientId,
        },
      });

      ContactInfo.fetchPatientsFromKeyValue = jest.fn(() => {
        return [{
          ...createPatient(),
          get() {
            return createPatient();
          }
        }];
      });

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
            ...createPatient(),
            get() {
              return createPatient();
            },
          },

          update() {
            console.log('Appointment is being updated!');
          },
        },
      ]);

      account.reminders = [makeReminderData()];

      await RemindersLibrary.sendRemindersForAccount({
        account,
        pub: mockPub,
        ...dates(),
      });

      expect(RemindersHelpers.getAppointmentsFromReminder).toHaveBeenCalledTimes(1);
      expect(sendReminder.sms).toHaveBeenCalledTimes(1);
    });

    /**
     * With 1 reminder, and 1 patient without a mobilePhoneNumber, it should NOT call sendReminder.sms
     */
    test('should NOT call sendReminder.sms for the 1 patient cause it has no mobilePhoneNumber', async () => {
      const createPatient = () => ({
        id: patientId,
        mobilePhoneNumber: null,
        pmsCreatedAt: new Date(2016, 1, 1),
        preferences: { sms: true },
        familyId: 'Jones',
        family: {
          id: 'Jones',
          pmsCreatedAt: new Date(2016, 1, 1),
          headId: patientId,
        },
      });

      ContactInfo.fetchPatientsFromKeyValue = jest.fn(() => {
        return [{
          ...createPatient(),
          get() {
            return createPatient();
          }
        }];
      });

      const mockAppointment = {
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
          ...createPatient(),
          get() {
            return createPatient();
          },
        },

        update() {
          console.log('Appointment is being updated!');
        },
      };

      // Make sure it returns a patient
      RemindersHelpers.getAppointmentsFromReminder = jest.fn(() => [mockAppointment]);

      account.reminders = [makeReminderData()];

      await RemindersLibrary.sendRemindersForAccount({ account, pub: mockPub, ...dates() });

      const sentReminderModel = await SentReminder.findOne({ where: { contactedPatientId: patientId } });

      expect(RemindersHelpers.getAppointmentsFromReminder).toHaveBeenCalledTimes(1);
      expect(sendReminder.sms).not.toHaveBeenCalled();
      expect(sentReminderModel.errorCode).toBe('1200');
    });

    /**
     * With 1 reminder, and 1 patient, it should call sendReminder.sms
     */
    test('should insert sentReminderPatient for the 1 patient', async () => {
      const createPatient = () => ({
        id: patientId,
        mobilePhoneNumber: '+16042433796',
        pmsCreatedAt: new Date(2016, 1, 1),
        preferences: { sms: true },
        familyId: 'Jones',
        family: {
          id: 'Jones',
          pmsCreatedAt: new Date(2016, 1, 1),
          headId: patientId,
        },
      });

      ContactInfo.fetchPatientsFromKeyValue = jest.fn(() => {
        return [{
          ...createPatient(),
          get() {
            return createPatient();
          }
        }];
      });

      const mockAppointment = {
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
          ...createPatient(),
          get() {
            return createPatient();
          },
        },

        update() {
          console.log('Appointment is being updated!');
        },
      };

      // Make sure it returns a patient
      RemindersHelpers.getAppointmentsFromReminder = jest.fn(() => [mockAppointment]);

      account.reminders = [makeReminderData()];

      await RemindersLibrary.sendRemindersForAccount({
        account,
        pub: mockPub,
        ...dates(),
      });

      const sentReminders = await SentReminder.findAll({
        where: { contactedPatientId: patientId },
        include: [
          {
            model: SentRemindersPatients,
            as: 'sentRemindersPatients',
          },
        ],
      });

      expect(sentReminders.length).toBe(1);
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
          interval: '2 hours',
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
          interval: '2 hours',
        },
        {
          accountId: newAccountId,
          primaryTypes: ['email', 'sms'],
          interval: '2 days',
          isDaily: true,
          dailyRunTime: '11:00:00',
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

  describe('organizeRemindersOutboxList', () => {
    const preferences = { sms: true, emailNotifications: true, phone: true };
    test('should be unique by appointment', () => {
      const appointments = [
        {
          appointment: { id: 1 },
          patient: { id: 2, preferences },
          dependants: [],
          primaryType: 'email',
        },
        {
          appointment: { id: 1 },
          patient: { id: 2, preferences },
          dependants: [],
          primaryType: 'sms',
        },
        {
          appointment: { id: 2 },
          patient: { id: 1, preferences },
          dependants: [],
          primaryType: 'sms',
        },
      ];
      const outBox = RemindersLibrary.organizeRemindersOutboxList(appointments);
      expect(outBox).toHaveLength(2);
      expect(outBox).toMatchSnapshot();
    });

    test('should be unique by appointment with dependants', () => {
      const appointments = [
        {
          patient: { id: 2, preferences },
          dependants: [
            {
              appointment: { id: 1 },
              patient: { id: 3, preferences },
            },
            {
              appointment: { id: 2 },
              patient: { id: 4, preferences },
            },
          ],
          primaryType: 'email',
        },
        {
          patient: { id: 2, preferences },
          dependants: [
            {
              appointment: { id: 1 },
              patient: { id: 3, preferences },
            },
            {
              appointment: { id: 2 },
              patient: { id: 4, preferences },
            },
          ],
          primaryType: 'sms',
        },
      ];
      const outBox = RemindersLibrary.organizeRemindersOutboxList(appointments);
      expect(outBox[0].dependants).toHaveLength(2);
      expect(outBox).toMatchSnapshot();
    });

    test('should be unique by appointment for dependants with PoC', () => {
      const appointments = [
        {
          patient: { id: 1, preferences },
          appointment: { id: 1 },
          dependants: [],
          primaryType: 'email',
        },
        {
          patient: { id: 2, preferences },
          dependants: [
            {
              appointment: { id: 1 },
              patient: { id: 1, preferences },
            },
          ],
          primaryType: 'sms',
        },
      ];
      const outBox = RemindersLibrary.organizeRemindersOutboxList(appointments);
      expect(outBox).toHaveLength(2);
      expect(outBox).toMatchSnapshot();
    });

    test('should be unique by appointment for dependants + PoC', () => {
      const appointments = [
        {
          patient: { id: 1, preferences },
          appointment: { id: 1 },
          dependants: [],
          primaryType: 'email',
        },
        {
          patient: { id: 2, preferences },
          appointment: { id: 2 },
          dependants: [
            {
              appointment: { id: 1 },
              patient: { id: 1, preferences },
            },
          ],
          primaryType: 'sms',
        },
      ];
      const outBox = RemindersLibrary.organizeRemindersOutboxList(appointments);
      expect(outBox).toHaveLength(2);
      expect(outBox).toMatchSnapshot();
    });

    test('should be unique by appointment for dependants with different PoCs per channel', () => {
      const appointments = [
        {
          patient: { id: 1, preferences },
          dependants: [
            {
              appointment: { id: 1 },
              patient: { id: 3, preferences },
            },
          ],
          primaryType: 'email',
        },
        {
          patient: { id: 2, preferences },
          dependants: [
            {
              appointment: { id: 1 },
              patient: { id: 3, preferences },
            },
          ],
          primaryType: 'sms',
        },
      ];
      const outBox = RemindersLibrary.organizeRemindersOutboxList(appointments);
      expect(outBox).toHaveLength(2);
      expect(outBox).toMatchSnapshot();
    });
  });
});
