
/**
 * MAJOR DISCLAIMER: this assumes the DB is seeded with seeds!
 */

import moment from 'moment';
import { Reminder, Account } from '../../server/models';
import {
  getAppointmentsFromReminder,
  shouldSendReminder,
  getValidSmsReminders,
} from '../../server/lib/reminders/helpers';

// TODO: make seeds more modular so we can see here
const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const patientId = '3aeab035-b72c-4f7a-ad73-09465cbf5654';
const oneDayReminderId = '8aeab035-b72c-4f7a-ad73-09465cbf5654';

describe('RemindersList Calculation Library', () => {
  describe('#computeRemindersAndSend', () => {
    it('should be a function', () => {
      const func = () => {};
      expect(typeof func).toBe('function');
    });

    /* it('should work..', (done) => {
      computerRemindersAndSend().then(() => done());
    });*/
  });

  describe('Helpers', () => {
    describe('#getAppointmentsFromReminder', () => {
      it('should be a function', () => {
        expect(typeof getAppointmentsFromReminder).toBe('function');
      });

      let reminder;
      beforeEach(async (done) => {
        reminder = await Reminder.get(oneDayReminderId);
        done();
      });

      it('should return 1 appointment that needs a reminder', async () => {
        const date = (new Date(2017, 5, 1, 7, 0)).toISOString();
        const appointments = await getAppointmentsFromReminder({ reminder, date });
        expect(appointments.length).toBe(1);
        expect(appointments[0].note).toBe('1 day away reminder');
      });

      // TODO: add date so that all checks are at a certain timestamp...
      // TODO; test fetching appointments outside of range
      // TODO: test fetching of appointments that have SentReminders
    });

    describe('#shouldSendReminder', () => {
      it('should be a function', () => {
        expect(typeof shouldSendReminder).toBe('function');
      });

      it('should return true if no sentReminders', () => {
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

      it('should return true if reminderId is not in sentReminders', () => {
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

      it('should return false if reminderId is not in sentReminders', () => {
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
      test.skip('should return false if patient.preferences does not want them', () => {
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
      it('Should be a function', () => {
        expect(typeof getValidSmsReminders).toBe('function');
      });

      it('should return [] for no validSmsReminders', async () => {
        const r = await getValidSmsReminders({
          patientId: 'cat',
          accountId: 'dog',
          date: (new Date(2017, 5, 1)).toISOString(),
        });

        expect(r.length).toBe(0);
      });

      it('should ignore non-sms and already confirmed', async () => {
        const r = await getValidSmsReminders({
          patientId,
          accountId,
          date: (new Date(2017, 5, 1)).toISOString(),
        });

        expect(r.length).toBe(2);
      });

      it('should respect createdAt order', async () => {
        const r = await getValidSmsReminders({
          patientId,
          accountId,
          date: (new Date(2017, 5, 1)).toISOString(),
        });

        expect(moment(r[0].createdAt).isBefore(r[1].createdAt)).toBe(true);
      });
    });
  });
});

