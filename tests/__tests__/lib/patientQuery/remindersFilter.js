import * as remindersFilterLibrary from '../../../../server/lib/patientsQuery/remindersFilter';

import { Account, Patient, Appointment, SentReminder, Reminder } from '../../../../server/_models';
import { wipeAllModels } from '../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../_util/seedTestUsers';
import { patientId, patient, seedTestPatients } from '../../../_util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../_util/seedTestPractitioners';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
}, data);

const makeSentReminderData = (data = {}) => Object.assign({
  // Doesnt even have to match recall for this test
  patientId,
  accountId,
  lengthSeconds: 15552000,
  createdAt: date(2000, 10, 10, 9),
}, data);

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();
const dates = (y, m, d, h) => {
  return {
    startDate: date(y, m, d, h),
    endDate: date(y, m, d, h + 1),
  };
};

describe('Reminder Filters Tests', () => {
  afterAll(async () => {
    await wipeAllModels();
  });

  beforeAll(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
  });

  describe('Recalls Filter ', () => {
    test('Should have 1 patient who has received a reminder email', async () => {

      const reminder = await Reminder.create({ accountId, primaryType: 'email', lengthSeconds: 15552000 });

      const reminderPlain = reminder.get({ plain: true });

      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', }),
      ]);

      const appointments = await Appointment.bulkCreate([
        makeApptData({ patientId: patients[0].id, ...dates(2000, 7, 5, 8) }),
        makeApptData({ patientId: patients[1].id, ...dates(2000, 8, 5, 9) }),
      ]);

      const sentReminder = await SentReminder.create(makeSentReminderData(
        { reminderId: reminderPlain.id, 
          primaryType: 'email',
          appointmentId: appointments[0].id,
        }));

      const data = [date(2000, 7, 5, 8), date(2000, 12, 5, 8)];

      const patientsData = await remindersFilterLibrary.RemindersFilter({ data, key: 'email' }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(1);
    });

    test('Should have 1 patient who has received a reminder sms', async () => {
      const reminder = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 15552000 });

      const reminderPlain = reminder.get({ plain: true });

      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', }),
      ]);

      const appointments = await Appointment.bulkCreate([
        makeApptData({ patientId: patients[0].id, ...dates(2000, 7, 5, 8) }),
        makeApptData({ patientId: patients[1].id, ...dates(2000, 8, 5, 9) }),
      ]);

      const sentReminder = await SentReminder.create(makeSentReminderData(
        { reminderId: reminderPlain.id, 
          primaryType: 'sms',
          appointmentId: appointments[0].id,
        }));

      const data = [date(2000, 7, 5, 8), date(2000, 12, 5, 8)];

      const patientsData = await remindersFilterLibrary.RemindersFilter({ data, key: 'sms' }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(1);
    });

    test('Should have 1 patient who has received a reminder phone', async () => {
      const reminder = await Reminder.create({ accountId, primaryType: 'phone', lengthSeconds: 15552000 });

      const reminderPlain = reminder.get({ plain: true });

      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient', }),
        makePatientData({ firstName: 'Recent', lastName: 'Patient', }),
      ]);

      const appointments = await Appointment.bulkCreate([
        makeApptData({ patientId: patients[0].id, ...dates(2000, 7, 5, 8) }),
        makeApptData({ patientId: patients[1].id, ...dates(2000, 8, 5, 9) }),
      ]);

      const sentReminder = await SentReminder.create(makeSentReminderData(
        { reminderId: reminderPlain.id, 
          primaryType: 'phone',
          appointmentId: appointments[0].id,
        }));

      const data = [date(2000, 7, 5, 8), date(2000, 12, 5, 8)];

      const patientsData = await remindersFilterLibrary.RemindersFilter({ data, key: 'phone' }, [], {}, accountId);
      expect(patientsData.rows.length).toBe(1);
    });
  });
});
