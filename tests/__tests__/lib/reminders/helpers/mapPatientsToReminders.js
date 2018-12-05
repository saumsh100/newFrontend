
import orderBy from 'lodash/orderBy';
import {
  Appointment,
  Patient,
  Reminder,
  Family,
} from 'CareCruModels';
import { mapPatientsToReminders } from '../../../../../server/lib/reminders/helpers';
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

const makeFamilyData = (data = {}) => ({
  accountId,
  ...data,
});

const makePatientData = (data = {}) => ({
  accountId,
  firstName: data.n,
  lastName: data.n,
  ...data,
});

const date = (y, m, d, h, mi = 0) => (new Date(y, m, d, h, mi)).toISOString();
const dates = (y, m, d, h, mi) => ({
  startDate: date(y, m, d, h, mi),
  endDate: date(y, m, d, h + 1, mi),
});

const order = success => orderBy(orderBy(success, s => s.primaryType), s => s.patient.firstName);
const orderPatients = patients => orderBy(patients, 'firstName');

describe('RemindersList Calculation Library', () => {
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
        const startDate = date(2018, 8, 13, 8); // Monday at 8am
        const endDate = date(2018, 8, 13, 9); // Monday at 9am
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
        expect(daysRemindersPatients.success.length).toBe(1); // Patient has email with other family members
        expect(daysRemindersPatients.success[0].dependants.length).toBe(0);
      });

      test('should return a success reminder for her and her sons to get the email, but a failure reminder for all 3 cause no mobilePhoneNumber', async () => {
        const startDate = date(2018, 8, 14, 8); // Tuesday at 8am
        const endDate = date(2018, 8, 14, 9); // Tuesday at 9am
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
        expect(daysRemindersPatients.success[0].dependants.length).toBe(2);
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

    describe('#mapPatientsToReminders - Rolling Reminders w/ Family Appointments', () => {
      let reminders;
      let patients;
      let families;
      let appointments;
      beforeEach(async () => {
        reminders = await Reminder.bulkCreate([
          {
            accountId,
            primaryTypes: ['email', 'sms'],
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
          makePatientData({ n: 'Mom', email: 'moms@rock.xyz', mobilePhoneNumber: '+12223334444', familyId: families[0].id, pmsCreatedAt: new Date(2018, 1, 1) }),
          makePatientData({ n: 'Dad', email: 'dads@rcool.xyz', mobilePhoneNumber: '+13334445555', familyId: families[0].id, pmsCreatedAt: new Date(2018, 2, 1) }),
          makePatientData({ n: 'Daughter', email: 'daughters@rweet.xyz', mobilePhoneNumber: '+12223334444', familyId: families[0].id, pmsCreatedAt: new Date(2018, 3, 1) }),
          makePatientData({ n: 'Son', email: 'moms@rock.xyz', mobilePhoneNumber: '+12223334444', familyId: families[0].id, pmsCreatedAt: new Date(2018, 1, 1) }),
          makePatientData({ n: 'Joe', email: 'average@joe.ca', mobilePhoneNumber: '+18887776666', pmsCreatedAt: new Date(2018, 2, 1) }),
        ]);

        appointments = await Appointment.bulkCreate([
          // Monday
          makeApptData({ ...dates(2018, 9, 10, 8), patientId: patients[0].id }), // Mom @ 8:00am
          makeApptData({ ...dates(2018, 9, 10, 8), patientId: patients[4].id }), // Joe @ 8:00am
          makeApptData({ ...dates(2018, 9, 10, 8, 30), patientId: patients[3].id }), // Son @ 8:30am
          makeApptData({ ...dates(2018, 9, 10, 8, 45), patientId: patients[1].id }), // Dad @ 8:45am
          makeApptData({ ...dates(2018, 9, 10, 13), patientId: patients[0].id }), // Mom @ 1:00pm
          makeApptData({ ...dates(2018, 9, 10, 13, 30), patientId: patients[2].id }), // Daughter @ 1:30pm
          makeApptData({ ...dates(2018, 9, 10, 16), patientId: patients[2].id }), // Daughter @ 4:00pm
        ]);

        await families[0].update({ headId: patients[0].id });
      });

      test('should return the correct success mom\'s family and joe', async () => {
        const startDate = date(2018, 9, 10, 6);
        const remindersPatients = await mapPatientsToReminders({
          reminders,
          account: { id: accountId },
          startDate,
        });

        expect(remindersPatients.length).toBe(2);
        const [hoursRemindersPatients] = remindersPatients;
        expect(hoursRemindersPatients.errors.length).toBe(0);
        const success = order(hoursRemindersPatients.success);
        expect(success.length).toBe(5);

        // This one is really a side affect of the current family reminders grouping
        expect(success[0].primaryType).toBe('email');
        expect(success[0].patient.firstName).toBe('Daughter');
        expect(success[0].dependants.length).toBe(0);
        expect(success[0].patient.appointment.id).toBe(appointments[5].id);

        expect(success[1].primaryType).toBe('email');
        expect(success[1].patient.firstName).toBe('Joe');
        expect(success[1].dependants.length).toBe(0);

        expect(success[2].primaryType).toBe('sms');
        expect(success[2].patient.firstName).toBe('Joe');
        expect(success[2].dependants.length).toBe(0);

        expect(success[3].primaryType).toBe('email');
        expect(success[3].patient.firstName).toBe('Mom');
        expect(success[3].patient.appointment.id).toBe(appointments[0].id);
        const deps1 = success[3].dependants;
        expect(deps1.length).toBe(1);
        expect(deps1[0].appointment.id).toBe(appointments[2].id);

        expect(success[4].primaryType).toBe('sms');
        expect(success[4].patient.firstName).toBe('Mom');
        const deps2 = orderPatients(success[4].dependants);
        expect(deps2.length).toBe(2);
        expect(deps2[0].appointment.id).toBe(appointments[5].id);
        expect(deps2[1].appointment.id).toBe(appointments[2].id);
      });

      test('should not get another reminder or triggering one for daughter for the 12pm', async () => {
        const startDate = date(2018, 9, 10, 11);
        const remindersPatients = await mapPatientsToReminders({
          reminders,
          account: { id: accountId },
          startDate,
        });

        expect(remindersPatients.length).toBe(2);
        const [hoursRemindersPatients] = remindersPatients;
        expect(hoursRemindersPatients.errors.length).toBe(0);
        expect(hoursRemindersPatients.success.length).toBe(0);
      });

      test('should return the correct appointments for the 2-day reminder being searched all day', async () => {
        const startDate = date(2018, 9, 8, 0);
        const endDate = date(2018, 9, 8, 24);
        const remindersPatients = await mapPatientsToReminders({
          reminders,
          account: { id: accountId },
          startDate,
          endDate,
        });

        expect(remindersPatients.length).toBe(2);
        const dayRemindersPatients = remindersPatients[1];
        expect(dayRemindersPatients.errors.length).toBe(0);
        const success = order(dayRemindersPatients.success);
        expect(success.length).toBe(7);

        // Email to Dad for 8:45
        expect(success[0].primaryType).toBe('email');
        expect(success[0].patient.firstName).toBe('Dad');
        expect(success[0].dependants.length).toBe(0);
        expect(success[0].patient.appointment.id).toBe(appointments[3].id);

        // SMS to Dad for 8:45
        expect(success[1].primaryType).toBe('sms');
        expect(success[1].patient.firstName).toBe('Dad');
        expect(success[1].dependants.length).toBe(0);
        expect(success[1].patient.appointment.id).toBe(appointments[3].id);

        // Email to Daughter for Daughter @ 1:30pm
        expect(success[2].primaryType).toBe('email');
        expect(success[2].patient.firstName).toBe('Daughter');
        expect(success[2].dependants.length).toBe(0);
        expect(success[2].patient.appointment.id).toBe(appointments[5].id);

        // Email to Joe for 8:15
        expect(success[3].primaryType).toBe('email');
        expect(success[3].patient.firstName).toBe('Joe');
        expect(success[3].dependants.length).toBe(0);
        expect(success[3].patient.appointment.id).toBe(appointments[1].id);

        // SMS to Joe for 8:15
        expect(success[4].primaryType).toBe('sms');
        expect(success[4].patient.firstName).toBe('Joe');
        expect(success[4].dependants.length).toBe(0);
        expect(success[4].patient.appointment.id).toBe(appointments[1].id);

        // Email to Mom for Mom @ 8:00, Son @ 8:30
        expect(success[5].primaryType).toBe('email');
        expect(success[5].patient.firstName).toBe('Mom');
        expect(success[5].dependants.length).toBe(1);
        expect(success[5].patient.appointment.id).toBe(appointments[0].id);
        expect(success[5].dependants[0].appointment.id).toBe(appointments[2].id);

        // SMS to Mom for Mom @ 8:00, Son @ 8:30, Daughter @ 1:30pm
        expect(success[6].primaryType).toBe('sms');
        expect(success[6].patient.firstName).toBe('Mom');
        expect(success[6].patient.appointment.id).toBe(appointments[0].id);
        const deps = orderPatients(success[6].dependants);
        expect(deps.length).toBe(2);
        expect(deps[0].appointment.id).toBe(appointments[5].id);
        expect(deps[1].appointment.id).toBe(appointments[2].id);
      });
    });
  });
});
