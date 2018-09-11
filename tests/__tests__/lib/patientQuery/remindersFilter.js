
import * as remindersFilterLibrary from '../../../../server/lib/patientsQuery/remindersFilter';
import {
  Patient, 
  Appointment, 
  SentReminder,
  SentRemindersPatients, 
  Reminder 
} from '../../../../server/_models';
import { wipeAllModels } from '../../../util/wipeModel';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { patientId, patient, seedTestPatients } from '../../../util/seedTestPatients';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';

const makeApptData = (data = {}) =>
  Object.assign(
    {
      accountId,
      patientId,
      practitionerId,
    },
    data,
  );

const makePatientData = (data = {}) =>
  Object.assign(
    {
      accountId,
    },
    data,
  );

const makeSentReminderData = (data = {}) =>
  Object.assign(
    {
      // Doesnt even have to match recall for this test
      contactedPatientId: patientId,
      accountId,
      lengthSeconds: 15552000,
      createdAt: date(2000, 10, 10, 9),
    },
    data,
  );

const makeSentReminderData2 = (data = {}) =>
  Object.assign(
    {
      // Doesnt even have to match recall for this test
      contactedPatientId: patientId,
      accountId,
      lengthSeconds: 15552000,
    },
    data,
  );

const date = (y, m, d, h) => new Date(y, m, d, h).toISOString();
const dates = (y, m, d, h) => ({
  startDate: date(y, m, d, h),
  endDate: date(y, m, d, h + 1),
});

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

  describe('Last Reminder Filter ', () => {
    test('Should have 2 patients who have a last reminder, ordered by lastName', async () => {
      const reminder = await Reminder.bulkCreate([
        { accountId, primaryType: 'email', lengthSeconds: 15552000 },
        { accountId, primaryType: 'sms', lengthSeconds: 1231233 },
      ]);

      const reminderPlain = reminder[0].get({ plain: true });
      const reminderPlain1 = reminder[1].get({ plain: true });
      const reminderPlain2 = reminder[1].get({ plain: true });

      const patients = await Patient.bulkCreate([
        makePatientData({ firstName: 'Old', lastName: 'Patient' }),
        makePatientData({ firstName: 'Recent', lastName: 'Zatient' }),
      ]);

      const appointments = await Appointment.bulkCreate([
        makeApptData({ patientId: patients[0].id, ...dates(2000, 7, 5, 8) }),
        makeApptData({ patientId: patients[0].id, ...dates(2000, 8, 5, 9) }),
        makeApptData({ patientId: patients[1].id, ...dates(2000, 11, 5, 9) }),
      ]);

      const sentReminder1 = await SentReminder.create(makeSentReminderData2({
        reminderId: reminderPlain.id,
        primaryType: 'email',
        createdAt: date(2000, 10, 10, 10),
        isSent: true,
      }));

      await SentRemindersPatients.create({
        sentRemindersId: sentReminder1.id,
        patientId: patients[0].id,
        appointmentId: appointments[0].id,
      });

      const sentReminder2 = await SentReminder.create(makeSentReminderData2({
        reminderId: reminderPlain1.id,
        primaryType: 'sms',
        createdAt: date(2000, 10, 10, 9),
        isSent: true,
      }));

      await SentRemindersPatients.create({
        sentRemindersId: sentReminder2.id,
        patientId: patients[0].id,
        appointmentId: appointments[1].id,
      });

      const sentReminder3 = await SentReminder.create(makeSentReminderData2({
        reminderId: reminderPlain2.id,
        contactedPatientId: patients[1].id,
        primaryType: 'sms',
        isSent: true,
        createdAt: date(2000, 12, 10, 9),
      }));

      await SentRemindersPatients.create({
        sentRemindersId: sentReminder3.id,
        patientId: patients[1].id,
        appointmentId: appointments[2].id,
      });

      const data = [date(2000, 8, 5, 8), date(2000, 12, 11, 8)];
      const query = { order: [['lastName', 'DESC']] };

      const patientsData = await remindersFilterLibrary.LastReminderFilter(
        { data },
        [],
        query,
        accountId,
      );
      expect(patientsData.rows.length).toBe(2);
      expect(patientsData.rows[0].lastName).toBe('Zatient');
    });
  });
});
