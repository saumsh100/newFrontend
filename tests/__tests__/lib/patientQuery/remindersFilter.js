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

const makeSentReminderData2 = (data = {}) => Object.assign({
  // Doesnt even have to match recall for this test
  accountId,
  lengthSeconds: 15552000,
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

  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
  });

  describe('Reminders Filter ', () => {
    test.skip('Should have 1 patient who has received a reminder email', async () => {

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

    test.skip('Should have 1 patient who has received a reminder sms', async () => {
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

    test.skip('Should have 1 patient who has received a reminder phone', async () => {
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
  describe('Last Reminder Filter ', () => {
    test('Should have 2 patients who have a last reminder, ordered by lastName', async () => {

      const reminder = await Reminder.bulkCreate([
        {accountId, primaryType: 'email', lengthSeconds: 15552000},
        {accountId, primaryType: 'sms', lengthSeconds: 1231233},
      ]);

      const reminderPlain = reminder[0].get({plain: true});
      const reminderPlain1 = reminder[1].get({plain: true});
      const reminderPlain2 = reminder[1].get({plain: true});


      const patients = await Patient.bulkCreate([
        makePatientData({firstName: 'Old', lastName: 'Patient'}),
        makePatientData({firstName: 'Recent', lastName: 'Zatient'}),
      ]);

      const appointments = await Appointment.bulkCreate([
        makeApptData({patientId: patients[0].id, ...dates(2000, 7, 5, 8)}),
        makeApptData({patientId: patients[0].id, ...dates(2000, 8, 5, 9)}),
        makeApptData({patientId: patients[1].id, ...dates(2000, 11, 5, 9)}),
      ]);

      await SentReminder.bulkCreate([
        makeSentReminderData2({
          reminderId: reminderPlain.id,
          primaryType: 'email',
          patientId: patients[0].id,
          appointmentId: appointments[0].id,
          createdAt: date(2000, 10, 10, 10),
        }),
        makeSentReminderData2({
          reminderId: reminderPlain1.id,
          primaryType: 'sms',
          patientId: patients[0].id,
          appointmentId: appointments[1].id,
          createdAt: date(2000, 10, 10, 9),
        }),
        makeSentReminderData2({
          reminderId: reminderPlain2.id,
          primaryType: 'sms',
          patientId: patients[1].id,
          appointmentId: appointments[2].id,
          createdAt: date(2000, 12, 10, 9),
        }),
      ]);

      const data = [date(2000, 8, 5, 8), date(2000, 12, 11, 8)];
      const query = {
        order: [['lastName', 'DESC']],
      };

      const patientsData = await remindersFilterLibrary.LastReminderFilter({ data }, [], query, accountId);
      expect(patientsData.rows.length).toBe(2);
      expect(patientsData.rows[0].lastName).toBe('Zatient');
    });
  });
});
