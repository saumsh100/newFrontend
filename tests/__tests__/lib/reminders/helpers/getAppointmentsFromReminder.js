
import { tzIso } from '@carecru/isomorphic';
import {
  Account,
  Appointment,
  DailySchedule,
  Patient,
  Reminder,
  WeeklySchedule,
} from 'CareCruModels';
import { saveWeeklyScheduleWithDefaults } from '../../../../../server/_models/WeeklySchedule';
import { getAppointmentsFromReminder } from '../../../../../server/lib/reminders/helpers';
import { wipeAllModels } from '../../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../../util/seedTestPractitioners';
import { seedTestChairs, chairId } from '../../../../util/seedTestChairs';

const makeApptData = (data = {}) => ({
  accountId,
  patientId,
  practitionerId,
  chairId,
  ...data,
});

const makePatientData = (data = {}) => ({
  accountId,
  firstName: data.n,
  lastName: data.n,
  ...data,
});

const TIME_ZONE = 'America/Vancouver';
const td = d => tzIso(d, TIME_ZONE);
const dates = d => ({ startDate: td(d), endDate: td(d) });

describe('Reminders Calculation Library', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
    await seedTestChairs();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('Helpers', () => {
    describe('#getAppointmentsFromReminder - isDaily & dontSendWhenClosed', () => {
      let weeklySchedule;
      let reminder;
      let appointments;
      let patients;
      beforeEach(async () => {
        weeklySchedule = await saveWeeklyScheduleWithDefaults({
          saturday: { isClosed: true },
          sunday: { isClosed: true },
        }, WeeklySchedule);

        reminder = await Reminder.create({
          accountId,
          primaryTypes: ['email', 'sms'],
          interval: '2 days',
          isDaily: true,
          dontSendWhenClosed: true,
        });

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'John', lastName: 'Doe', mobilePhoneNumber: '+12223334444', email: 'a@b.c' }),
          makePatientData({ firstName: 'Janet', lastName: 'Jackson', mobilePhoneNumber: '+13334445555', email: 'd@e.f' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates('2019-07-29 08:00:00'), patientId: patients[0].id }), // Monday at 8am
          makeApptData({ ...dates('2019-07-29 09:00:00'), patientId: patients[1].id }), // Monday at 9am
        ]);

        await Account.update(
          {
            weeklyScheduleId: weeklySchedule.id,
          },
          { where: { id: accountId } },
        );
      });

      test('return 2 appointments for monday because saturday and sunday are closed', async () => {
        // For an 8-5 Monday, and a 6-8 Wednesday, These reminders should return
        const appts = await getAppointmentsFromReminder({
          reminder,
          account: { id: accountId, timezone: TIME_ZONE, weeklyScheduleId: weeklySchedule.id },
          startDate: td('2019-07-26 08:00:00'),
        });

        expect(appts.length).toBe(2);
      });

      test('return 0 appointments for monday because saturday is now open due to a dailySchedule override', async () => {
        const ds = await DailySchedule.create({
          accountId,
          date: '2019-07-27',
          isClosed: false,
          startTime: td('2019-07-27 08:00:00'),
          endTime: td('2019-07-27 17:00:00'),
        });

        // For an 8-5 Monday, and a 6-8 Wednesday, These reminders should return
        const appts = await getAppointmentsFromReminder({
          reminder,
          account: { id: accountId, timezone: TIME_ZONE, weeklyScheduleId: weeklySchedule.id },
          startDate: td('2019-07-26 08:00:00'),
        });

        expect(appts.length).toBe(0);
      });
    });
  });
});
