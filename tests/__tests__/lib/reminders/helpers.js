
/**
 * MAJOR DISCLAIMER: this assumes the DB is seeded with seeds!
 */

import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
  Account,
  Appointment,
  Chair,
  Patient,
  Reminder,
  SentReminder,
  SentRemindersPatients,
  WeeklySchedule,
} from 'CareCruModels';
import {
  getAppointmentsFromReminder,
  shouldSendReminder,
  getValidSmsReminders,
  confirmReminderIfExist,
} from '../../../../server/lib/reminders/helpers';
import { tzIso } from '../../../../server/util/time';
import wipeModel, { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';

const TIME_ZONE = 'America/Vancouver';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makePatientData = (data = {}) => Object.assign({ accountId }, data);

const makeSentReminderData = (data = {}) => Object.assign({
  // Doesn't even have to match reminder for this test
  contactedPatientId: patientId,
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

const td = d => tzIso(d, TIME_ZONE);

const seedWithNonConfirmableAppointments = async ({ reminder, appointments }) => {
  // Seed 3 SentReminders for the patient
  const sentReminder1 = await SentReminder.create(makeSentReminderData({
    reminderId: reminder.id,
    createdAt: date(2017, 7, 4, 1),
  }));

  await SentRemindersPatients.create({
    sentRemindersId: sentReminder1.id,
    appointmentId: appointments[5].id,
    patientId,
  });

  const sentReminder2 = await SentReminder.create(makeSentReminderData({
    reminderId: reminder.id,
    createdAt: date(2017, 7, 4, 2),
  }));

  await SentRemindersPatients.create({
    sentRemindersId: sentReminder2.id,
    appointmentId: appointments[6].id,
    patientId,
  });

  const sentReminder3 = await SentReminder.create(makeSentReminderData({
    reminderId: reminder.id,
    createdAt: date(2017, 7, 4, 3),
  }));

  await SentRemindersPatients.create({
    sentRemindersId: sentReminder3.id,
    appointmentId: appointments[7].id,
    patientId,
  });

  const sentReminder4 = await SentReminder.create(makeSentReminderData({
    reminderId: reminder.id,
    createdAt: date(2017, 7, 4, 4),
  }));

  await SentRemindersPatients.create({
    sentRemindersId: sentReminder4.id,
    appointmentId: appointments[8].id,
    patientId,
  });

  const sentReminder5 = await SentReminder.create(makeSentReminderData({
    reminderId: reminder.id,
    createdAt: date(2017, 7, 4, 5),
  }));

  await SentRemindersPatients.create({
    sentRemindersId: sentReminder5.id,
    appointmentId: appointments[9].id,
    patientId,
  });

  await SentRemindersPatients.create({
    sentRemindersId: sentReminder5.id,
    appointmentId: appointments[11].id,
    patientId,
  });

  await SentRemindersPatients.create({
    sentRemindersId: sentReminder5.id,
    appointmentId: appointments[10].id,
    patientId,
  });
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
        const appts = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 7, 6, 7) }), // Tomorrow at 7
          makeApptData({ ...dates(2017, 7, 6, 7) }), // Tomorrow at 7
        ]);

        const sentReminder =
          await SentReminder.create(makeSentReminderData({ reminderId: reminder.id }));

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder.id,
          appointmentId: appts[0].id,
          patientId,
        });

        const apptsReminders =
          await getAppointmentsFromReminder({
            reminder,
            startDate: currentDate,
          });
        expect(apptsReminders.length).toBe(1);
        expect(apptsReminders[0].id).toBe(appts[1].id);
      });

      test('should return 0 appointments as the other now has a different and earlier reminder sent (dont send 21 day reminders if the 1 day reminder has been sent)', async () => {
        const currentDate = date(2017, 7, 5, 7);

        const appts = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 7, 6, 7) }), // Tomorrow at 7
        ]);

        const diffReminder = await Reminder.create({
          accountId,
          primaryTypes: ['sms'],
          interval: '500 seconds',
        });

        const sentReminder = await SentReminder.create({
          reminderId: diffReminder.id,
          appointmentId: appts[0].id,
          contactedPatientId: patientId,
          accountId,
          // Doesnt even have to match reminder for this test
          interval: '500 seconds',
          primaryType: 'sms',
        });

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder.id,
          appointmentId: appts[0].id,
          patientId,
        });

        const remindersAppts = await getAppointmentsFromReminder({
          reminder,
          startDate: currentDate,
        });

        expect(remindersAppts.length).toBe(0);
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

    describe('#getAppointmentsFromReminder - omitChairIds', () => {
      let chair;
      let reminder;
      let appointments;
      let patients;
      beforeEach(async () => {
        chair = await Chair.create({
          accountId,
          name: 'Chair 1',
        });

        reminder = await Reminder.create({
          accountId,
          interval: '4 weeks',
          primaryTypes: ['email', 'sms'],
          omitChairIds: [chair.id],
        });

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'John', lastName: 'Doe' }),
          makePatientData({ firstName: 'Janet', lastName: 'Jackson' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 8, 5, 8), patientId: patients[0].id, chairId: chair.id }), // in 4 weeks at 8am
          makeApptData({ ...dates(2017, 8, 5, 9), patientId: patients[1].id, chairId: chair.id }), // in 4 weeks at 9am
        ]);
      });

      test('should not return any appointments because of omitChairIds', async () => {
        const startDate = date(2017, 7, 8, 8);
        const endDate = date(2017, 7, 8, 10); // make it 2 hours because we don't include endDate in boundary
        const appointments = await getAppointmentsFromReminder({ reminder, startDate, endDate });
        expect(appointments.length).toBe(0);
      });

      test('should return 2 appointments because we updated omitChairIds on reminder to be []', async () => {
        const startDate = date(2017, 7, 8, 8);
        const endDate = date(2017, 7, 8, 10); // make it 2 hours because we don't include endDate in boundary
        const newReminder = await reminder.update({ omitChairIds: [] });
        const appts = await getAppointmentsFromReminder({ reminder: newReminder, startDate, endDate });
        expect(appts.length).toBe(2);
        expect(appts[0].patientId).toBe(patients[0].id);
        expect(appts[1].patientId).toBe(patients[1].id);
      });
    });

    describe('#getAppointmentsFromReminder - ignoreSendIfConfirmed', () => {
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
        const startDate = date(2017, 7, 22, 6);
        const endDate = date(2017, 7, 22, 24); // make it 2 hours because we don't include endDate in boundary

        // add another one for the first patient for later
        await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 8, 5, 9), patientId: patients[0].id }),
          makeApptData({ ...dates(2017, 8, 5, 10), patientId: patients[1].id }),
          makeApptData({ ...dates(2017, 8, 5, 17), patientId: patients[0].id }),
        ]);

        const appts = await getAppointmentsFromReminder({ reminder, account: { timezone: TIME_ZONE }, startDate, endDate });
        expect(appts.length).toBe(2);
        expect(appts[0].patientId).toBe(patients[1].id);
        expect(appts[1].patientId).toBe(patients[0].id);
        expect(appts[0].startDate.toISOString()).toBe(date(2017, 8, 5, 9));
        expect(appts[1].startDate.toISOString()).toBe(date(2017, 8, 5, 17));
      });
    });

    describe('#getAppointmentsFromReminder - ignoreSendIfConfirmed + isCustomConfirm', () => {
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

    describe('#getAppointmentsFromReminder - isDaily', () => {
      let reminder;
      let appointments;
      let patients;
      beforeEach(async () => {
        reminder = await Reminder.create({
          accountId,
          interval: '2 days',
          primaryTypes: ['email', 'sms'],
          isDaily: true,
        });

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'John', lastName: 'Doe' }),
          makePatientData({ firstName: 'Janet', lastName: 'Jackson' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 8, 5, 8), patientId: patients[0].id }),
          makeApptData({ ...dates(2017, 8, 5, 17), patientId: patients[1].id }),
        ]);
      });

      test('should return 1 appointment because the first one is already custom confirmed', async () => {
        const startDate = date(2017, 8, 3, 11);
        const appts = await getAppointmentsFromReminder({ reminder, account: { timezone: 'America/Vancouver' },  startDate });
        expect(appts.length).toBe(2);
        expect(appts[0].patientId).toBe(patients[0].id);
        expect(appts[1].patientId).toBe(patients[1].id);
      });
    });

    describe('#getAppointmentsFromReminder - dontSendOnClosedDays', () => {
      let reminder;
      let appointments;
      let patients;
      let weeklySchedules;
      let account;
      beforeEach(async () => {
        reminder = await Reminder.create({
          accountId,
          interval: '2 days',
          primaryTypes: ['email', 'sms'],
          isDaily: true,
          dontSendWhenClosed: true,
        });

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'John', lastName: 'Doe' }),
          makePatientData({ firstName: 'Janet', lastName: 'Jackson' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 8, 4, 8), patientId: patients[0].id }),
          makeApptData({ ...dates(2017, 8, 5, 17), patientId: patients[1].id }),
          makeApptData({ ...dates(2017, 8, 6, 8), patientId: patients[1].id }),
        ]);

        weeklySchedules = await WeeklySchedule.bulkCreate([
          {
            friday: { isClosed: true },
            saturday: { isClosed: true },
            sunday: { isClosed: true },
          },
        ]);

        account = await Account.findById(accountId);
        account = await account.update({ weeklyScheduleId: weeklySchedules[0].id });
      });

      test('should return 0 appointments because the clinic is closed', async () => {
        const startDate = date(2017, 8, 3, 11); // Sunday
        const appts = await getAppointmentsFromReminder({ reminder, account, startDate });
        expect(appts.length).toBe(0);
      });

      test('should return 2 appointments because the clinic is closed the next 3 days', async () => {
        const startDate = date(2017, 7, 31, 11); // Thursday

        // Has to send for Monday and Tuesday's appts but not Wednesday's
        const appts = await getAppointmentsFromReminder({ reminder, account, startDate });
        expect(appts.length).toBe(2);
      });
    });

    describe('#getAppointmentsFromReminder - Patient.omitReminderIds', () => {
      let reminder;
      let appointments;
      let patients;
      beforeEach(async () => {
        reminder = await Reminder.create({
          accountId,
          interval: '4 weeks',
          primaryTypes: ['email', 'sms'],
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

      test('should return 2 appointments because they have no omitReminderIds that relate to this reminder', async () => {
        const startDate = date(2017, 7, 8, 8);
        const endDate = date(2017, 7, 8, 10); // make it 2 hours because we don't include endDate in boundary
        const appts = await getAppointmentsFromReminder({ reminder, startDate, endDate });
        expect(appts.length).toBe(2);
        expect(appts[0].patientId).toBe(patients[0].id);
        expect(appts[1].patientId).toBe(patients[1].id);
      });

      test('should return 1 appointments because 1 has a omitReminderId that relates to this reminder', async () => {
        const startDate = date(2017, 7, 8, 8);
        const endDate = date(2017, 7, 8, 10); // make it 2 hours because we don't include endDate in boundary
        await patients[0].update({ omitReminderIds: [reminder.id] })
        const appts = await getAppointmentsFromReminder({ reminder, startDate, endDate });
        expect(appts.length).toBe(1);
        expect(appts[0].patientId).toBe(patients[1].id);
      });

      test('should return 2 appointments because 1 has a omitReminderId that does not relate to this reminder', async () => {
        const startDate = date(2017, 7, 8, 8);
        const endDate = date(2017, 7, 8, 10); // make it 2 hours because we don't include endDate in boundary
        await patients[0].update({ omitReminderIds: [uuid()] })
        const appts = await getAppointmentsFromReminder({ reminder, startDate, endDate });
        expect(appts.length).toBe(2);
        expect(appts[0].patientId).toBe(patients[0].id);
        expect(appts[1].patientId).toBe(patients[1].id);
      });
    });

    describe('#getAppointmentsFromReminder - reminder.startTime', () => {
      let account;
      let reminder;
      let appointments;
      let patients;
      beforeEach(async () => {
        account = { timezone: TIME_ZONE };
        reminder = await Reminder.create({
          accountId,
          interval: '2 hours',
          primaryTypes: ['sms'],
          startTime: '07:00:00',
        });

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'John', lastName: 'Doe' }),
          makePatientData({ firstName: 'Janet', lastName: 'Jackson' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ startDate: td('2018-08-15 07:00'), endDate: td('2018-08-15 08:00'), patientId: patients[0].id }),
          makeApptData({ startDate: td('2018-08-15 08:00'), endDate: td('2018-08-15 09:00'), patientId: patients[0].id }),
          makeApptData({ startDate: td('2018-08-15 09:00'), endDate: td('2018-08-15 10:00'), patientId: patients[1].id }),
          makeApptData({ startDate: td('2018-08-15 10:00'), endDate: td('2018-08-15 11:00'), patientId: patients[0].id }),
        ]);
      });

      test('should return Janet Jackson for her 9am for whole day', async () => {
        const startDate = td('2018-08-15 00:00');
        const endDate = td('2018-08-15 24:00');
        const appts = await getAppointmentsFromReminder({ reminder, account, startDate, endDate });
        expect(appts.length).toBe(1);
        expect(appts[0].patientId).toBe(patients[1].id);
        expect(appts[0].startDate.toISOString()).toBe(td('2018-08-15 09:00'));
      });

      test('should return Janet Jackson for her 9am and John Doe for his 7am', async () => {
        await reminder.update({ startTime: null });
        const startDate = td('2018-08-15 00:00');
        const endDate = td('2018-08-15 24:00');
        const appts = await getAppointmentsFromReminder({ reminder, account, startDate, endDate });
        expect(appts.length).toBe(2);
        expect(appts[0].patientId).toBe(patients[0].id);
        expect(appts[0].startDate.toISOString()).toBe(td('2018-08-15 07:00'));
        expect(appts[1].patientId).toBe(patients[1].id);
        expect(appts[1].startDate.toISOString()).toBe(td('2018-08-15 09:00'));
      });

      test('should return no appointments', async () => {
        const startDate = td('2018-08-15 05:00');
        const appts = await getAppointmentsFromReminder({ reminder, account, startDate });
        expect(appts.length).toBe(0);
      });

      test('should return Janet Jackson for her 9am', async () => {
        const startDate = td('2018-08-15 07:00');
        const appts = await getAppointmentsFromReminder({ reminder, account, startDate });
        expect(appts.length).toBe(1);
        expect(appts[0].patientId).toBe(patients[1].id);
        expect(appts[0].startDate.toISOString()).toBe(td('2018-08-15 09:00'));
      });

      test('should return none because John Doe has an earlier ignore appointment', async () => {
        const startDate = td('2018-08-15 08:00');
        const appts = await getAppointmentsFromReminder({ reminder, account, startDate });
        expect(appts.length).toBe(0);
      });
    });

    describe('#shouldSendReminder', () => {
      test('should be a function', () => {
        expect(typeof shouldSendReminder).toBe('function');
      });

      test('should return true if no sentReminders', () => {
        const reminder = {};
        const appointment = {
          sentRemindersPatients: [],
          patient: { preferences: { reminders: true } },
        };

        expect(shouldSendReminder({
          appointment,
          reminder,
        })).toBe(true);
      });

      test('should return true if reminderId is not in sentReminders', () => {
        const reminder = {
          id: 2,
          interval: '2 hours',
        };

        const appointment = {
          sentRemindersPatients: [
            {
              get: () => ({
                sentReminder: {
                  reminderId: 1,
                  interval: '1 days',
                },
              }),
            },
          ],

          patient: { preferences: { reminders: true } },
        };

        expect(shouldSendReminder({
          appointment,
          reminder,
        })).toBe(true);
      });

      test('should return false if reminderId is not in sentReminders', () => {
        const reminder = {
          id: 1,
          interval: '2 hours',
        };

        const appointment = {
          sentRemindersPatients: [
            {
              sentReminder: {
                reminderId: 1,
                interval: '1 days',
              },

              get: () => ({
                sentReminder: {
                  reminderId: 1,
                  interval: '1 days',
                },
              }),
            },
          ],

          patient: { preferences: { reminders: true } },
        };

        expect(shouldSendReminder({
          appointment,
          reminder,
        })).toBe(false);
      });

      // We put this test in originally when we would not create SentReminder based on prefs
      // Now we still create it. But the communication will not end. Thus resulting in an
      //  isSent=false SentReminder
      // Which lets the receptionist know that she has a failed reminder for an appointment.
      test('should return false if patient.preferences does not want them', () => {
        const reminder = {};
        const appointment = {
          sentRemindersPatients: [],
          patient: { preferences: { reminders: false } },
        };

        expect(shouldSendReminder({
          appointment,
          reminder,
        })).toBe(false);
      });
    });

    describe('#getValidSmsReminders', () => {
      test('Should be a function', () => {
        expect(typeof getValidSmsReminders).toBe('function');
      });

      let reminder;
      let appointments;
      beforeEach(async () => {
        reminder = await Reminder.create({
          accountId,
          primaryTypes: ['sms'],
          interval: '86400 seconds',
        });

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
          makeApptData({ ...dates(2017, 7, 5, 9) }), // Today at 9
          makeApptData({ ...dates(2017, 7, 6, 10) }), // Tomorrow at 10
          makeApptData({ isCancelled: true, ...dates(2017, 7, 6, 10) }), // Tomorrow at 10
          makeApptData({ isShortCancelled: true, ...dates(2017, 7, 6, 10) }), // Tomorrow at 10
          makeApptData({ isCancelled: true, ...dates(2017, 7, 7, 10) }), // 7th at 10 Cancelled
          makeApptData({ isDeleted: true, ...dates(2017, 7, 8, 10) }), // 8th at 10 Deleted
          makeApptData({ isPending: true, ...dates(2017, 7, 9, 10) }), // 9th at 10 Pending
          makeApptData({ isMissed: true, ...dates(2017, 7, 10, 10) }), // 10th at 10 Missed
          makeApptData({ isCancelled: true, ...dates(2017, 7, 10, 11) }), // 10th at 11 Canceled
          makeApptData({ ...dates(2017, 7, 10, 12) }), // 10th at 12 Confirmable
          makeApptData({ ...dates(2017, 7, 5, 7) }), // 5th at 7 Confirmable but old
        ]);
      });

      afterEach(async () => {
        await wipeModel(SentRemindersPatients);
        await wipeModel(SentReminder);
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
        const sentReminder1 = await SentReminder.create(makeSentReminderData({
          reminderId: reminder.id,
          isConfirmed: true,
        }));

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder1.id,
          appointmentId: appointments[0].id,
          patientId,
        });

        const sentReminder2 =
          await SentReminder.create(makeSentReminderData({ reminderId: reminder.id }));

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder2.id,
          appointmentId: appointments[1].id,
          patientId,
        });

        const sentReminder3 = await SentReminder.create(makeSentReminderData({
          reminderId: reminder.id,
          primaryType: 'phone',
        }));

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder3.id,
          appointmentId: appointments[2].id,
          patientId,
        });

        const r = await getValidSmsReminders({
          patientId,
          accountId,
          date: date(2017, 7, 5, 7),
        });

        expect(r.length).toBe(1);
      });

      test('should respect createdAt order', async () => {
        // Seed 3 SentReminders for the patient
        const sentReminder1 = await SentReminder.create(makeSentReminderData({
          reminderId: reminder.id,
          createdAt: date(2017, 7, 4, 1),
        }));

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder1.id,
          appointmentId: appointments[0].id,
          patientId,
        });

        const sentReminder2 = await SentReminder.create(makeSentReminderData({
          reminderId: reminder.id,
          createdAt: date(2017, 7, 4, 2),
        }));

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder2.id,
          appointmentId: appointments[1].id,
          patientId,
        });

        const sentReminder3 = await SentReminder.create(makeSentReminderData({
          reminderId: reminder.id,
          createdAt: date(2017, 7, 4, 3),
        }));

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder3.id,
          appointmentId: appointments[2].id,
          patientId,
        });

        const r = await getValidSmsReminders({
          patientId,
          accountId,
          date: date(2017, 7, 5, 7),
        });

        expect(r).toHaveLength(3);
        expect(moment(r[0].createdAt).isBefore(r[1].createdAt)).toBe(true);
      });

      test('should get next available reminder to confirm is appointments can\'t be confirmable', async () => {
        await seedWithNonConfirmableAppointments({
          reminder,
          appointments,
        });

        const r = await getValidSmsReminders({
          patientId,
          accountId,
          date: date(2017, 7, 5, 7),
        });

        expect(r).toHaveLength(1);
        expect(r[0].sentRemindersPatients[0].appointmentId).toBe(appointments[10].id);
      });
    });

    describe('#confirmReminderIfExist', async () => {
      test('should be a function', () => {
        expect(typeof confirmReminderIfExist).toBe('function');
      });

      let reminder;
      let appointments;
      beforeEach(async () => {
        reminder = await Reminder.create({
          accountId,
          primaryTypes: ['sms'],
          interval: '86400 seconds',
        });

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 7, 10, 10) }), // 10th at 10 Confirmable
          makeApptData({ ...dates(2017, 7, 10, 11) }), // 10th at 11 Confirmable
          makeApptData({ ...dates(2017, 7, 10, 12) }), // 10th at 12 Confirmable
          makeApptData({ ...dates(2017, 7, 26, 12) }), // 26th at 12 Confirmable
          makeApptData({ ...dates(2017, 7, 24, 12) }), // 24th at 12 Confirmable
        ]);
      });

      afterEach(async () => {
        await wipeModel(SentRemindersPatients);
        await wipeModel(SentReminder);
        await wipeModel(Appointment);
      });

      test('Should confirm a single appointment reminder', async () => {
        const sentReminder1 = await SentReminder.create(makeSentReminderData({
          reminderId: reminder.id,
          createdAt: date(2017, 7, 4, 5),
        }));

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder1.id,
          appointmentId: appointments[0].id,
          patientId,
        });

        const validSmsReminders =
          await confirmReminderIfExist(accountId, patientId, date(2017, 7, 5, 7));
        const confirmedSentReminder = await SentReminder.findOne({
          where: { id: sentReminder1.id },
          include: [
            {
              model: SentRemindersPatients,
              as: 'sentRemindersPatients',
              include: [
                {
                  model: Appointment,
                  as: 'appointment',
                },
              ],
            },
          ],
        });

        expect(validSmsReminders).toHaveLength(1);
        expect(confirmedSentReminder.isConfirmed).toBeTruthy();
        expect(confirmedSentReminder.sentRemindersPatients[0].appointment.isPatientConfirmed)
          .toBeTruthy();
      });

      test('Should confirm a multiple appointments reminder', async () => {
        const sentReminder1 = await SentReminder.create(makeSentReminderData({
          reminderId: reminder.id,
          createdAt: date(2017, 7, 4, 5),
        }));

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder1.id,
          appointmentId: appointments[0].id,
          patientId,
        });

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder1.id,
          appointmentId: appointments[1].id,
          patientId,
        });

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder1.id,
          appointmentId: appointments[2].id,
          patientId,
        });

        const validSmsReminders =
          await confirmReminderIfExist(accountId, patientId, date(2017, 7, 5, 7));
        const confirmedSentReminder = await SentReminder.findOne({
          where: { id: sentReminder1.id },
          include: [
            {
              model: SentRemindersPatients,
              as: 'sentRemindersPatients',
              include: [
                {
                  model: Appointment,
                  as: 'appointment',
                },
              ],
            },
          ],
        });

        expect(validSmsReminders).toHaveLength(1);
        expect(confirmedSentReminder.isConfirmed).toBeTruthy();
        confirmedSentReminder.sentRemindersPatients.forEach(({ appointment }) => {
          expect(appointment.isPatientConfirmed).toBeTruthy();
        });
      });

      test('Should confirm the reminder for the closest appointment', async () => {
        const sentReminder1 = await SentReminder.create(makeSentReminderData({
          reminderId: reminder.id,
          createdAt: date(2017, 7, 5, 4), // first sent reminder
          interval: '7 days',
        }));

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder1.id,
          appointmentId: appointments[3].id,
          patientId,
        });

        const sentReminder2 = await SentReminder.create(makeSentReminderData({
          reminderId: reminder.id,
          createdAt: date(2017, 7, 5, 5),
          interval: '3 days',
        }));

        await SentRemindersPatients.create({
          sentRemindersId: sentReminder2.id,
          appointmentId: appointments[4].id, // closest appointment
          patientId,
        });

        const validSmsReminders =
          await confirmReminderIfExist(accountId, patientId, date(2017, 7, 24, 7));
        const confirmedSentReminder = await SentReminder.findAll({
          include: [
            {
              model: SentRemindersPatients,
              as: 'sentRemindersPatients',
              include: [
                {
                  model: Appointment,
                  as: 'appointment',
                },
              ],
            },
          ],
        });

        expect(validSmsReminders).toHaveLength(2);
        expect(confirmedSentReminder[0].isConfirmed).toBeFalsy();
        expect(confirmedSentReminder[1].isConfirmed).toBeTruthy();
        expect(confirmedSentReminder[0].sentRemindersPatients[0].appointment.isPatientConfirmed)
          .toBeFalsy();
        expect(confirmedSentReminder[1].sentRemindersPatients[0].appointment.isPatientConfirmed)
          .toBeTruthy();
      });
    });
  });
});
