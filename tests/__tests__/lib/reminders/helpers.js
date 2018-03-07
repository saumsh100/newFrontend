
/**
 * MAJOR DISCLAIMER: this assumes the DB is seeded with seeds!
 */

import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
  Appointment,
  Patient,
  Practitioner,
  Reminder,
  SentReminder,
  Family,
} from '../../../../server/_models';
import {
  getAppointmentsFromReminder,
  shouldSendReminder,
  getValidSmsReminders,
  mapPatientsToReminders,
} from '../../../../server/lib/reminders/helpers';
import wipeModel, { wipeAllModels } from '../../../_util/wipeModel';
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

const makeSentReminderData = (data = {}) => Object.assign({
  // Doesn't even have to match reminder for this test
  patientId,
  accountId,
  interval: '1 days',
  primaryType: 'sms',
}, data);

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();
const dates = (y, m, d, h) => {
  return {
    startDate: date(y, m, d, h),
    endDate: date(y, m, d, h + 1),
  };
};

describe('RemindersList Calculation Library', () => {
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
    test.skip('#getAppointmentsFromReminder - creating later on reminder first - should return 1', async () => {
      // Seed 3 SentReminders for the patient
      const reminder1 = await Reminder.create({ accountId, primaryTypes: ['sms'], interval: '1086410 seconds' });
      const reminder2 = await Reminder.create({ accountId, primaryTypes: ['sms'], interval: '1086400 seconds' });

      const appts = await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      const currentDate = date(2017, 7, 5, 7);

      await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        appointmentId: appts[0].id,
        interval: '1086410 seconds',
      }));

      const appts2 = await getAppointmentsFromReminder({ reminder: reminder2, startDate: currentDate });

      expect(appts2.length).toBe(1);
    });

    test.skip('#getAppointmentsFromReminder - creating earlier reminder first - should return 0', async () => {
      // Seed 3 SentReminders for the patient

      const reminder1 = await Reminder.create({ accountId, primaryTypes: ['sms'], interval: '1086410 seconds' });
      const reminder2 = await Reminder.create({ accountId, primaryTypes: ['sms'], interval: '1086400 seconds' });


      await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      const currentDate = date(2017, 7, 5, 7);

      const appts = await getAppointmentsFromReminder({ reminder: reminder2, startDate: currentDate });

      await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        appointmentId: appts[0].id,
        interval: '1086410 seconds',
      }));

      const appts2 = await getAppointmentsFromReminder({ reminder: reminder1, startDate: currentDate });

      expect(appts2.length).toBe(0);
    });

    test('#getAppointmentsFromReminder - with past appointment', async () => {
      // 2 hour sms reminder
      const reminder = await Reminder.create({ accountId, primaryTypes: ['sms'], interval: '7200 seconds' });

      await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 6, 5, 8) }), // A Month ago at 8
        makeApptData({ ...dates(2017, 7, 5, 9) }), // Today at 9
        makeApptData({ ...dates(2017, 7, 5, 10) }), // Today at 10
      ]);

      const currentDate = date(2017, 7, 5, 7);
      const appts = await getAppointmentsFromReminder({ reminder, startDate: currentDate });
      expect(appts.length).toBe(1);
    });

    test('#getAppointmentsFromReminder - with Cancelled and Pending appointment - return 0', async () => {
      // Seed 3 SentReminders for the patient
      const reminder = await Reminder.create({ accountId, primaryTypes: ['sms'], interval: '1086400 seconds' });

      await Appointment.bulkCreate([
        makeApptData({ isCancelled: true, ...dates(2017, 7, 5, 8) }), // Today at 8
        makeApptData({ isShortCancelled: true, ...dates(2017, 7, 5, 9) }), // Today at 9
        makeApptData({ isPending: true, ...dates(2017, 7, 5, 9) }), // Today at 9
      ]);
      const currentDate = date(2017, 7, 5, 7);
      const appts = await getAppointmentsFromReminder({ reminder, startDate: currentDate });
      expect(appts.length).toBe(0);
    });

    describe('#getAppointmentsFromReminder', () => {
      test('should be a function', () => {
        expect(typeof getAppointmentsFromReminder).toBe('function');
      });

      let reminder;
      let appointments;
      beforeEach(async () => {
        // 24 hour sms Reminder
        reminder = await Reminder.create({ accountId, primaryTypes: ['sms'], interval: '86400 seconds' });
        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
          makeApptData({ ...dates(2017, 7, 5, 9) }), // Today at 9
          makeApptData({ ...dates(2017, 7, 6, 10) }), // Tomorrow at 10
          makeApptData({ isCancelled: true, ...dates(2017, 7, 6, 7) }), // Tomorrow at 7
          makeApptData({ isShortCancelled: true, ...dates(2017, 7, 6, 7) }), // Tomorrow at 7
          makeApptData({ isShortCancelled: true, ...dates(2017, 7, 6, 7) }), // Tomorrow at 7
        ]);
      });

      test('should return 0 appointments that need a reminder', async () => {
        // #getAppointmentsFromReminder - creating earlier reminder first - should return 0
        const currentDate = date(2017, 7, 5, 7);
        const appts = await getAppointmentsFromReminder({ reminder, startDate: currentDate });
        expect(appts.length).toBe(0);
      });

      test('should return 1 appointment as the other has reminder already sent', async () => {
        const currentDate = date(2017, 7, 5, 7);
        const _appts = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 7, 6, 7) }), // Tomorrow at 7
          makeApptData({ ...dates(2017, 7, 6, 7) }), // Tomorrow at 7
        ]);

        await SentReminder.create(makeSentReminderData({
          reminderId: reminder.id,
          appointmentId: _appts[0].id,
        }));

        const appts = await getAppointmentsFromReminder({ reminder, startDate: currentDate });
        expect(appts.length).toBe(1);
        expect(appts[0].id).toBe(_appts[1].id);
      });

      test('should return 0 appointments as the other now has a different and earlier reminder sent (dont send 21 day reminders if the 1 day reminder has been sent)', async () => {
        const currentDate = date(2017, 7, 5, 7);

        const _appts = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 7, 6, 7) }), // Tomorrow at 7
        ]);

        const diffReminder = await Reminder.create({
          accountId,
          primaryTypes: ['sms'],
          interval: '500 seconds',
        });

        await SentReminder.create({
          reminderId: diffReminder.id,
          appointmentId: _appts[0].id,
          patientId,
          accountId,
          // Doesnt even have to match reminder for this test
          interval: '500 seconds',
          primaryType: 'sms',
        });

        const appts = await getAppointmentsFromReminder({ reminder, startDate: currentDate });
        expect(appts.length).toBe(0);
      });

      describe('#getAppointmentsFromReminder -- sameDay Appointments', () => {
        let reminder;
        let appointments;
        beforeEach(async () => {
          await wipeModel(Appointment);

          // 24 hour sms Reminder
          reminder = await Reminder.create({ accountId, primaryTypes: ['sms'], interval: '2 hours' });
          appointments = await Appointment.bulkCreate([
            makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
            makeApptData({ ...dates(2017, 7, 5, 9) }), // Today at 9
          ]);
        });

        test('should return 8:00 appointment if patient has a later appointment at 9:00', async () => {
          const startDate = date(2017, 7, 5, 6);
          const appointments = await getAppointmentsFromReminder({ reminder, startDate });
          expect(appointments.length).toBe(1);
        });

        test('should not return 9:00 appointment if patient had another appointment at 8:00', async () => {
          const startDate = date(2017, 7, 5, 7);
          const appointments = await getAppointmentsFromReminder({ reminder, startDate });
          expect(appointments.length).toBe(0);
        });

        test('should not return 1 8:00 appointment even though patient has multiple at that time', async () => {
          await Appointment.create(makeApptData({ ...dates(2017, 7, 5, 8) }));

          const startDate = date(2017, 7, 5, 6);
          const appointments = await getAppointmentsFromReminder({ reminder, startDate });
          expect(appointments.length).toBe(1);
        });
      });

      // TODO: add date so that all checks are at a certain timestamp...
      // TODO; test fetching appointments outside of range
      // TODO: test fetching of appointments that have SentReminders
    });

    describe('#getAppointmentsFromReminder - omitPractitionerIds', () => {
      let reminder;
      let appointments;
      let patients;
      beforeEach(async () => {
        reminder = await Reminder.create({
          accountId,
          interval: '4 weeks',
          primaryTypes: ['email', 'sms'],
          omitPractitionerIds: [practitionerId],
        });

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'John', lastName: 'Doe' }),
          makePatientData({ firstName: 'Janet', lastName: 'Jackson' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 8, 5, 8), patientId: patients[0].id }), // in 4 weeks at 8am
          makeApptData({ ...dates(2017, 8, 5, 9), patientId: patients[1].id }), // in 4 weeks at 9am
        ]);
      });

      test('should not return any appointments because of omitPractitionerIds', async () => {
        const startDate = date(2017, 7, 8, 8);
        const endDate = date(2017, 7, 8, 10); // make it 2 hours because we don't include endDate in boundary
        const appointments = await getAppointmentsFromReminder({ reminder, startDate, endDate });
        expect(appointments.length).toBe(0);
      });

      test('should return 2 appointments because we updated omitPractitionerIds on reminder to be []', async () => {
        const startDate = date(2017, 7, 8, 8);
        const endDate = date(2017, 7, 8, 10); // make it 2 hours because we don't include endDate in boundary
        const newReminder = await reminder.update({ omitPractitionerIds: [] });
        const appts = await getAppointmentsFromReminder({ reminder: newReminder, startDate, endDate });
        expect(appts.length).toBe(2);
        expect(appts[0].patientId).toBe(patients[0].id);
        expect(appts[1].patientId).toBe(patients[1].id);
      });
    });

    describe('#getAppointmentsFromReminder - ingoreSendIfConfirmed', () => {
      let reminder;
      let appointments;
      let patients;
      beforeEach(async () => {
        reminder = await Reminder.create({
          accountId,
          interval: '2 weeks',
          primaryTypes: ['email', 'sms'],
          ignoreSendIfConfirmed: true,
        });

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'John', lastName: 'Doe' }),
          makePatientData({ firstName: 'Janet', lastName: 'Jackson' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 8, 5, 8), patientId: patients[0].id, isPatientConfirmed: true }), // in 4 weeks at 8am
          makeApptData({ ...dates(2017, 8, 5, 9), patientId: patients[1].id }), // in 4 weeks at 9am
        ]);
      });

      test('should return 1 appointment because the first one is already confirmed', async () => {
        const startDate = date(2017, 7, 22, 8);
        const endDate = date(2017, 7, 22, 10); // make it 2 hours because we don't include endDate in boundary
        const appts = await getAppointmentsFromReminder({ reminder, startDate, endDate });
        expect(appts.length).toBe(1);
        expect(appts[0].patientId).toBe(patients[1].id);
      });

      test('should return 2 appointments because neither is already confirmed', async () => {
        const startDate = date(2017, 7, 22, 8);
        const endDate = date(2017, 7, 22, 10); // make it 2 hours because we don't include endDate in boundary

        // go back to it being unconfirmed
        await appointments[0].update({ isPatientConfirmed: false });
        const appts = await getAppointmentsFromReminder({ reminder, startDate, endDate });
        expect(appts.length).toBe(2);
        expect(appts[0].patientId).toBe(patients[0].id);
        expect(appts[1].patientId).toBe(patients[1].id);
      });

      test('should not return appointment even if there\'s a later one that is not confirmed', async () => {
        const startDate = date(2017, 7, 22, 8);
        const endDate = date(2017, 7, 22, 17); // make it 2 hours because we don't include endDate in boundary

        // add another one for the first patient for later
        await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 8, 5, 9), patientId: patients[0].id }),
          makeApptData({ ...dates(2017, 8, 5, 10), patientId: patients[1].id }),
          makeApptData({ ...dates(2017, 8, 5, 17), patientId: patients[0].id }),
        ]);

        const appts = await getAppointmentsFromReminder({ reminder, startDate, endDate });
        expect(appts.length).toBe(2);
        expect(appts[0].patientId).toBe(patients[1].id);
        expect(appts[1].patientId).toBe(patients[0].id);
        expect(appts[0].startDate.toISOString()).toBe(date(2017, 8, 5, 9));
        expect(appts[1].startDate.toISOString()).toBe(date(2017, 8, 5, 17));
      });
    });

    describe('#getAppointmentsFromReminder - ingoreSendIfConfirmed + isCustomConfirm', () => {
      let reminder;
      let appointments;
      let patients;
      beforeEach(async () => {
        reminder = await Reminder.create({
          accountId,
          interval: '2 weeks',
          primaryTypes: ['email', 'sms'],
          ignoreSendIfConfirmed: true,
          isCustomConfirm: true,
          customConfirmData: { isPreConfirmed: true },
        });

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'John', lastName: 'Doe' }),
          makePatientData({ firstName: 'Janet', lastName: 'Jackson' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 8, 5, 8), patientId: patients[0].id, isPreConfirmed: true }), // in 4 weeks at 8am
          makeApptData({ ...dates(2017, 8, 5, 9), patientId: patients[1].id }), // in 4 weeks at 9am
        ]);
      });

      test('should return 1 appointment because the first one is already custom confirmed', async () => {
        const startDate = date(2017, 7, 22, 8);
        const endDate = date(2017, 7, 22, 10); // make it 2 hours because we don't include endDate in boundary
        const appts = await getAppointmentsFromReminder({ reminder, startDate, endDate });
        expect(appts.length).toBe(1);
        expect(appts[0].patientId).toBe(patients[1].id);
      });

      test('should return 1 appointment because the first one is already custom confirmed', async () => {
        const startDate = date(2017, 7, 22, 8);
        const endDate = date(2017, 7, 22, 10); // make it 2 hours because we don't include endDate in boundary
        const newReminder = await reminder.update({ customConfirmData: { reason: 'Cat' } });
        await appointments[0].update({ reason: 'Cat' });
        const appts = await getAppointmentsFromReminder({ reminder: newReminder, startDate, endDate });
        expect(appts.length).toBe(1);
        expect(appts[0].patientId).toBe(patients[1].id);
      });
    });

    describe('#shouldSendReminder', () => {
      test('should be a function', () => {
        expect(typeof shouldSendReminder).toBe('function');
      });

      test('should return true if no sentReminders', () => {
        const reminder = {};
        const appointment = {
          sentReminders: [],
          patient: {
            preferences: {
              reminders: true,
            },
          },
        };

        expect(shouldSendReminder({ appointment, reminder })).toBe(true);
      });

      test('should return true if reminderId is not in sentReminders', () => {
        const reminder = { id: 2, interval: '2 hours' };
        const appointment = {
          sentReminders: [
            { reminderId: 1, interval: '1 days' },
          ],

          patient: {
            preferences: {
              reminders: true,
            },
          },
        };

        expect(shouldSendReminder({ appointment, reminder })).toBe(true);
      });

      test('should return false if reminderId is not in sentReminders', () => {
        const reminder = { id: 1, interval: '2 hours' };
        const appointment = {
          sentReminders: [
            { reminderId: 1, interval: '1 days' },
          ],

          patient: {
            preferences: {
              reminders: true,
            },
          },
        };

        expect(shouldSendReminder({ appointment, reminder })).toBe(false);
      });

      // We put this test in originally when we would not create SentReminder based on prefs
      // Now we still create it. But the communication will not esnd. Thus resulting in an isSent=false SentReminder
      // Which lets the receptionist know that she has a failed reminder for an appointment.
      test('should return false if patient.preferences does not want them', () => {
        const reminder = {};
        const appointment = {
          sentReminders: [],
          patient: {
            preferences: {
              reminders: false,
            },
          },
        };

        expect(shouldSendReminder({ appointment, reminder })).toBe(false);
      });
    });

    describe('#getValidSmsReminders', () => {
      test('Should be a function', () => {
        expect(typeof getValidSmsReminders).toBe('function');
      });

      let reminder;
      let appointments;
      beforeEach(async () => {
        reminder = await Reminder.create({ accountId, primaryTypes: ['sms'], interval: '86400 seconds' });
        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
          makeApptData({ ...dates(2017, 7, 5, 9) }), // Today at 9
          makeApptData({ ...dates(2017, 7, 6, 10) }), // Tomorrow at 10
          makeApptData({ isCancelled: true, ...dates(2017, 7, 6, 10) }), // Tomorrow at 10
          makeApptData({ isShortCancelled: true, ...dates(2017, 7, 6, 10) }), // Tomorrow at 10
        ]);
      });

      test('should return [] for no validSmsReminders', async () => {
        const r = await getValidSmsReminders({
          patientId: uuid(),
          accountId: uuid(),
          date: (new Date(2017, 5, 1)).toISOString(),
        });

        expect(r.length).toBe(0);
      });

      test('should ignore non-sms and already confirmed', async () => {
        // Seed 3 SentReminders for the patient
        await SentReminder.bulkCreate([
          makeSentReminderData({
            reminderId: reminder.id,
            appointmentId: appointments[0].id,
            isConfirmed: true,
          }),

          makeSentReminderData({
            reminderId: reminder.id,
            appointmentId: appointments[1].id,
          }),

          makeSentReminderData({
            reminderId: reminder.id,
            appointmentId: appointments[2].id,
            primaryType: 'phone',
          }),
        ]);

        const r = await getValidSmsReminders({
          patientId,
          accountId,
          date: date(2017, 7, 5, 7),
        });

        expect(r.length).toBe(1);
      });

      test('should respect createdAt order', async () => {
        // Seed 3 SentReminders for the patient
        await SentReminder.bulkCreate([
          makeSentReminderData({
            reminderId: reminder.id,
            appointmentId: appointments[0].id,
            createdAt: date(2017, 7, 4, 1),
          }),

          makeSentReminderData({
            reminderId: reminder.id,
            appointmentId: appointments[1].id,
            createdAt: date(2017, 7, 4, 2),
          }),

          makeSentReminderData({
            reminderId: reminder.id,
            appointmentId: appointments[2].id,
            primaryType: 'phone',
          }),
        ]);

        const r = await getValidSmsReminders({
          patientId,
          accountId,
          date: date(2017, 7, 5, 7),
        });

        expect(moment(r[0].createdAt).isBefore(r[1].createdAt)).toBe(true);
      });
    });

    describe('#mapPatientsToReminders', () => {
      let reminders;
      let appointments;
      beforeEach(async () => {
        reminders = await Reminder.bulkCreate([
          {
            accountId,
            primaryTypes: ['sms'],
            interval: '2 hours',
          },
          {
            accountId,
            primaryTypes: ['email', 'sms'],
            interval: '2 days',
          },
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 11, 11, 8) }), // Monday at 8am
          makeApptData({ ...dates(2017, 11, 11, 11) }), // Monday at 11am
          makeApptData({ ...dates(2017, 11, 12, 15) }), // Tuesday at 3pm
          makeApptData({ ...dates(2017, 11, 13, 6) }), // Wednesday at 6am
          makeApptData({ ...dates(2017, 11, 13, 20) }), // Wednesday at 8pm
        ]);
      });

      test('should return the proper patients and appointments for a longer startDate endDate range', async () => {
        // For an 8-5 Monday, and a 6-8 Wednesday, These reminders should return
        const startDate = date(2017, 11, 11, 6);
        const endDate = date(2017, 11, 11, 20);
        const remindersPatients = await mapPatientsToReminders({
          reminders,
          account: { id: accountId },
          startDate,
          endDate,
        });

        expect(remindersPatients.length).toBe(2);

        const [hoursRemindersPatients, daysRemindersPatients] = remindersPatients;
        expect(hoursRemindersPatients.errors.length).toBe(0); // Patient has all info
        expect(hoursRemindersPatients.success.length).toBe(1); // Monday at 8am
        expect(daysRemindersPatients.errors.length).toBe(0); // Patient has all info
        expect(daysRemindersPatients.success.length).toBe(4); // Tuesday at 8am both email & sms
      });

      test('should range does not capture the appts outside of it for 2 day', async () => {
        // For an 8-5 Monday, and a 6-8 Wednesday, These reminders should return
        const startDate = date(2017, 11, 11, 7);
        const endDate = date(2017, 11, 11, 19);
        const remindersPatients = await mapPatientsToReminders({
          reminders,
          account: { id: accountId },
          startDate,
          endDate,
        });

        expect(remindersPatients.length).toBe(2);

        const [hoursRemindersPatients, daysRemindersPatients] = remindersPatients;
        expect(hoursRemindersPatients.errors.length).toBe(0); // Patient has all info
        expect(hoursRemindersPatients.success.length).toBe(0); // Monday at 11am gets ignore cause there was an earlier appts
        expect(daysRemindersPatients.errors.length).toBe(0); // Patient has all info
        expect(daysRemindersPatients.success.length).toBe(0); // Outside of the range
      });

      test('if no endDate specified, use startDate', async () => {
        // For an 8-5 Monday, and a 6-8 Wednesday, These reminders should return
        const startDate = date(2017, 11, 11, 6);
        const remindersPatients = await mapPatientsToReminders({
          reminders,
          account: { id: accountId },
          startDate,
        });

        expect(remindersPatients.length).toBe(2);

        const [hoursRemindersPatients, daysRemindersPatients] = remindersPatients;
        expect(hoursRemindersPatients.errors.length).toBe(0); // Patient has all info
        expect(hoursRemindersPatients.success.length).toBe(1); // Monday at 8am & Monday at 11am
        expect(hoursRemindersPatients.success[0].patient.appointment.id === appointments[0].id);
        expect(daysRemindersPatients.errors.length).toBe(0); // Patient has all info
        expect(daysRemindersPatients.success.length).toBe(2); // Wednesday at 6am email & sms
      });
    });
  });
});

