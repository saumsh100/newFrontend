
import {
  Account,
  Appointment,
  Chair,
  Patient,
  Practitioner,
  Reminder,
  SentReminder,
  Family,
  WeeklySchedule,
} from 'CareCruModels';
import { mapPatientsToReminders } from '../../../../../server/lib/reminders/helpers';
import { wipeAllModels } from '../../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../../util/seedTestPractitioners';

// const TIME_ZONE = 'America/Vancouver';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makeFamilyData = (data = {}) => Object.assign({
  accountId,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
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
        expect(daysRemindersPatients.success.length).toBe(2); // Tuesday at 8am both email & sms
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

    describe('#mapPatientsToReminders - isDaily', () => {
      let reminders;
      let appointments;
      let patients;
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
            isDaily: true,
          },
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'John', lastName: 'Doe', mobilePhoneNumber: '+12223334444', email: 'a@b.c' }),
          makePatientData({ firstName: 'Janet', lastName: 'Jackson', mobilePhoneNumber: '+13334445555', email: 'd@e.f' }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2017, 11, 11, 8), patientId: patients[0].id }), // Monday at 8am
          makeApptData({ ...dates(2017, 11, 11, 11), patientId: patients[1].id }), // Monday at 11am
          makeApptData({ ...dates(2017, 11, 12, 15), patientId: patients[0].id }), // Tuesday at 3pm
          makeApptData({ ...dates(2017, 11, 13, 6), patientId: patients[0].id }), // Wednesday at 6am
          makeApptData({ ...dates(2017, 11, 13, 20), patientId: patients[1].id }), // Wednesday at 8pm
        ]);
      });

      test('should return the proper patients and appointments for a longer startDate endDate range', async () => {
        // For an 8-5 Monday, and a 6-8 Wednesday, These reminders should return
        const startDate = date(2017, 11, 11, 6);
        const remindersPatients = await mapPatientsToReminders({
          reminders,
          account: { id: accountId, timezone: 'America/Vancouver'},
          startDate,
        });

        expect(remindersPatients.length).toBe(2);
        const [hoursRemindersPatients, daysRemindersPatients] = remindersPatients;
        expect(hoursRemindersPatients.errors.length).toBe(0); // Patient has all info
        expect(hoursRemindersPatients.success.length).toBe(1); // Monday at 8am
        expect(daysRemindersPatients.errors.length).toBe(0); // Patients have all info
        expect(daysRemindersPatients.success.length).toBe(4); // Wednesday all day
      });
    });

    describe('#mapPatientsToReminders - Contact Info Service Checks', () => {
      let reminders;
      let patients;
      let families;
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

        families = await Family.bulkCreate([
          makeFamilyData({ pmsCreatedAt: new Date(2018, 1, 1) }),
        ]);

        patients = await Patient.bulkCreate([
          makePatientData({ firstName: 'A', lastName: 'A', email: 'moms@rock.xyz', familyId: families[0].id, pmsCreatedAt: new Date(2018, 1, 1) }),
          makePatientData({ firstName: 'B', lastName: 'B', email: 'moms@rock.xyz', familyId: families[0].id, pmsCreatedAt: new Date(2018, 2, 1) }),
          makePatientData({ firstName: 'C', lastName: 'C', email: 'moms@rock.xyz', familyId: families[0].id, pmsCreatedAt: new Date(2018, 3, 1) }),
        ]);

        appointments = await Appointment.bulkCreate([
          makeApptData({ ...dates(2018, 8, 15, 8), patientId: patients[0].id }), // Wednesday at 8am
          makeApptData({ ...dates(2018, 8, 16, 8), patientId: patients[0].id }), // Thursday at 8am
          makeApptData({ ...dates(2018, 8, 16, 8), patientId: patients[1].id }), // Thursday at 8am
          makeApptData({ ...dates(2018, 8, 16, 8), patientId: patients[2].id }), // Thursday at 8am
        ]);

        await families[0].update({ headId: patients[0].id });
      });

      test('should return the correct success and error for 1 patient that is the family head', async () => {
        const startDate = date(2018, 8, 13, 8);
        const endDate = date(2018, 8, 13, 9);
        const remindersPatients = await mapPatientsToReminders({
          reminders,
          account: { id: accountId },
          startDate,
          endDate,
        });

        expect(remindersPatients.length).toBe(2);

        const [hoursRemindersPatients, daysRemindersPatients] = remindersPatients;

        expect(hoursRemindersPatients.errors.length).toBe(0);
        expect(hoursRemindersPatients.success.length).toBe(0);
        expect(daysRemindersPatients.errors.length).toBe(1); // Patient is missing mobilePhoneNumber
        expect(daysRemindersPatients.errors[0].errorCode).toBe('1200');
        expect(daysRemindersPatients.success.length).toBe(1); // Patient has email
      });

      test('should return a success reminder for her and her sons to get the email, but a failure reminder for all 3 cause no mobilePhoneNumber', async () => {
        const startDate = date(2018, 8, 14, 8);
        const endDate = date(2018, 8, 14, 9);
        const remindersPatients = await mapPatientsToReminders({
          reminders,
          account: { id: accountId },
          startDate,
          endDate,
        });

        expect(remindersPatients.length).toBe(2);
        const [hoursRemindersPatients, daysRemindersPatients] = remindersPatients;
        expect(hoursRemindersPatients.errors.length).toBe(0);
        expect(hoursRemindersPatients.success.length).toBe(0);
        expect(daysRemindersPatients.errors.length).toBe(3); // Patient is missing mobilePhoneNumber but for 3 patients
        expect(daysRemindersPatients.errors[0].errorCode).toBe('1200');
        expect(daysRemindersPatients.errors[1].errorCode).toBe('1200');
        expect(daysRemindersPatients.errors[2].errorCode).toBe('1200');
        expect(daysRemindersPatients.success.length).toBe(1); // Patient has email
      });

      test('should a success reminder for her and her sons to get the email, a success reminder for her son to get an SMS one (non-family), and 2 failure reminders for her and her 1 other son for the SMS', async () => {
        await patients[2].update({ mobilePhoneNumber: '+12223334444' });
        const startDate = date(2018, 8, 14, 8);
        const endDate = date(2018, 8, 14, 9);
        const remindersPatients = await mapPatientsToReminders({
          reminders,
          account: { id: accountId },
          startDate,
          endDate,
        });

        expect(remindersPatients.length).toBe(2);
        const [hoursRemindersPatients, daysRemindersPatients] = remindersPatients;
        expect(hoursRemindersPatients.errors.length).toBe(0);
        expect(hoursRemindersPatients.success.length).toBe(0);
        expect(daysRemindersPatients.errors.length).toBe(2); // Patient is missing mobilePhoneNumber but for 2 patients
        expect(daysRemindersPatients.errors[0].errorCode).toBe('1200');
        expect(daysRemindersPatients.errors[1].errorCode).toBe('1200');
        expect(daysRemindersPatients.success.length).toBe(2); // Patient head with email, and Patient with his owm mobilePhoneNumber
      });
    });
  });
});
