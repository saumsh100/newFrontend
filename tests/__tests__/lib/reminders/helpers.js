
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
} from '../../../../server/lib/reminders/helpers';
import { wipeAllModels } from '../../../_util/wipeModel';
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

const makeSentReminderData = (data = {}) => Object.assign({
  // Doesnt even have to match reminder for this test
  patientId,
  accountId,
  lengthSeconds: 86400,
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

    test('#getAppointmentsFromReminder - creating later on reminder first - should return 1', async () => {
      // Seed 3 SentReminders for the patient

      const reminder1 = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 1086410 });
      const reminder2 = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 1086400 });


      await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      const currentDate = date(2017, 7, 5, 7);

      const appts = await getAppointmentsFromReminder({ reminder: reminder1, date: currentDate });

      await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        appointmentId: appts[0].id,
        lengthSeconds: 1086410,
      }));

      const appts2 = await getAppointmentsFromReminder({ reminder: reminder2, date: currentDate });

      expect(appts2.length).toBe(1);
    });

    test('#getAppointmentsFromReminder - creating earlier reminder first - should return 0', async () => {
      // Seed 3 SentReminders for the patient

      const reminder1 = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 1086410 });
      const reminder2 = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 1086400 });


      await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      const currentDate = date(2017, 7, 5, 7);

      const appts = await getAppointmentsFromReminder({ reminder: reminder2, date: currentDate });

      await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        appointmentId: appts[0].id,
        lengthSeconds: 1086410,
      }));

      const appts2 = await getAppointmentsFromReminder({ reminder: reminder1, date: currentDate });

      expect(appts2.length).toBe(0);
    });

    test('#getAppointmentsFromReminder - with past appointment', async () => {
      // Seed 3 SentReminders for the patient

      const reminder = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 1086400 });


      await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 6, 5, 8) }), // A Month ago at 8
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
        makeApptData({ ...dates(2017, 7, 5, 9) }), // Today at 9
      ]);
      const currentDate = date(2017, 7, 5, 7);
      const appts = await getAppointmentsFromReminder({ reminder, date: currentDate });
      expect(appts.length).toBe(2);
    });

    test('#getAppointmentsFromReminder - with Cancelled appointment - return 0', async () => {
      // Seed 3 SentReminders for the patient

      const reminder = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 1086400 });


      await Appointment.bulkCreate([
        makeApptData({ isCancelled: true, ...dates(2017, 7, 5, 8) }), // Today at 8
        makeApptData({ isShortCancelled: true, ...dates(2017, 7, 5, 9) }), // Today at 9
      ]);
      const currentDate = date(2017, 7, 5, 7);
      const appts = await getAppointmentsFromReminder({ reminder, date: currentDate });
      expect(appts.length).toBe(0);
    });

    describe('#getAppointmentsFromReminder', () => {
      test('should be a function', () => {
        expect(typeof getAppointmentsFromReminder).toBe('function');
      });

      let reminder;
      let appointments;
      beforeEach(async () => {
        reminder = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 86400 });
        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
          makeApptData({ ...dates(2017, 7, 5, 9) }), // Today at 9
          makeApptData({ ...dates(2017, 7, 6, 10) }), // Tomorrow at 10
          makeApptData({ isCancelled: true, ...dates(2017, 7, 6, 7) }), // Tomorrow at 7
          makeApptData({ isShortCancelled: true, ...dates(2017, 7, 6, 7) }), // Tomorrow at 7
        ]);
      });

      test('should return 2 appointments that need a reminder', async () => {
        const currentDate = date(2017, 7, 5, 7);
        const appts = await getAppointmentsFromReminder({ reminder, date: currentDate });
        expect(appts.length).toBe(2);
      });

      test('should return 1 appointment as the other has reminder already sent', async () => {
        const currentDate = date(2017, 7, 5, 7);
        await SentReminder.create(makeSentReminderData({
          reminderId: reminder.id,
          appointmentId: appointments[0].id,
        }));

        const appts = await getAppointmentsFromReminder({ reminder, date: currentDate });
        expect(appts.length).toBe(1);
      });

      test('should return 1 appointment as the other has a different and earlier reminder sent (dont send 21 day reminders if the 1 day reminder has been sent)', async () => {
        const currentDate = date(2017, 7, 5, 7);
        const diffReminder = await Reminder.create({
          accountId,
          primaryType: 'sms',
          lengthSeconds: 86401,
        });

        await SentReminder.create({
          reminderId: reminder.id,
          appointmentId: appointments[0].id,
          patientId,
          accountId,
          // Doesnt even have to match reminder for this test
          lengthSeconds: 86400,
          primaryType: 'sms',
        });

        const appts = await getAppointmentsFromReminder({ reminder: diffReminder, date: currentDate });
        expect(appts.length).toBe(1);
      });

      // TODO: add date so that all checks are at a certain timestamp...
      // TODO; test fetching appointments outside of range
      // TODO: test fetching of appointments that have SentReminders
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
        const reminder = { id: 2 };
        const appointment = {
          sentReminders: [
            { id: 1 },
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
        const reminder = { id: 1 };
        const appointment = {
          sentReminders: [
            { reminderId: 1 },
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
        reminder = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 86400 });
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
  });
});

