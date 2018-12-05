
import moment from 'moment';
import {
  Appointment,
  Patient,
  Family,
  DeliveredProcedure,
  Reminder,
  SentReminder,
  SentRemindersPatients,
} from 'CareCruModels';
import {
  allInsights,
  checkConfirmAttempts,
} from '../../../../server/lib/patientInsights/patientInformation';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../util/seedTestPatients';
import { seedTestProcedures, wipeTestProcedures } from '../../../util/seedTestProcedures';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';
import { seedTestChairs, chairId } from '../../../util/seedTestChairs';
import wipeModel, { wipeAllModels } from '../../../util/wipeModel';

const makeApptData = (data = {}) => ({
  accountId,
  patientId,
  practitionerId,
  chairId,
  ...data,
});

const makePatientData = (data = {}) => ({
  accountId,
  ...data,
});

const makeFamilyData = (data = {}) => ({
  accountId,
  ...data,
});

const makeSentReminderData = (data = {}) => ({
  contactedPatientId: patientId,
  accountId,
  lengthSeconds: 86400,
  primaryType: 'sms',
  ...data,
});

const date = (y, m, d, h) => (new Date(y, m, d, h)).toISOString();
const dates = (y, m, d, h) => ({
  startDate: date(y, m, d, h),
  endDate: date(y, m, d, h + 1),
});

describe('Patient Insights', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
    await seedTestProcedures();
    await seedTestChairs();
  });

  afterAll(async () => {
    await wipeModel(DeliveredProcedure);
    await wipeTestProcedures();
    await wipeAllModels();
  });

  describe('#checkConfirmAttempts - returns the amount of confirm attempts by type', () => {
    test('should be a function', () => {
      expect(typeof allInsights).toBe('function');
      expect(typeof checkConfirmAttempts).toBe('function');
    });

    afterEach(async () => {
      await wipeModel(SentRemindersPatients);
      await wipeModel(SentReminder);
      await wipeModel(Reminder);
      await wipeModel(Appointment);
    });

    test('should have one sms reminder - with one sms sent reminder no confirmation', async () => {
      const reminder1 = await Reminder.create({
        accountId, primaryType: 'sms', lengthSeconds: 1086410, interval: '6 months',
      });
      const appts = await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      const sentReminder1 = await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        lengthSeconds: 1086410,
        isSent: true,
      }));

      await SentRemindersPatients.create({
        sentRemindersId: sentReminder1.id,
        patientId,
        appointmentId: appts[0].id,
      });

      const confirm = await checkConfirmAttempts(appts[0].id);

      expect(confirm.sms).toBe(1);
      expect(confirm.phone).toBe(0);
      expect(confirm.email).toBe(0);
    });

    test('should have one phone reminder - with one phone sent reminder no confirmation', async () => {
      const reminder1 = await Reminder.create({
        accountId, primaryType: 'sms', lengthSeconds: 1086410, interval: '6 months',
      });

      const appts = await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      const sentReminder1 = await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        lengthSeconds: 1086410,
        isSent: true,
        primaryType: 'phone',
      }));

      await SentRemindersPatients.create({
        sentRemindersId: sentReminder1.id,
        patientId,
        appointmentId: appts[0].id,
      });

      const confirm = await checkConfirmAttempts(appts[0].id);

      expect(confirm.sms).toBe(0);
      expect(confirm.phone).toBe(1);
      expect(confirm.email).toBe(0);
    });

    test('should have one email reminder - with one email sent reminder no confirmation', async () => {
      const reminder1 = await Reminder.create({
        accountId,
        primaryType: 'sms',
        lengthSeconds: 1086410,
        interval: '6 months',
      });

      const appts = await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      const sentReminder1 = await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        lengthSeconds: 1086410,
        isSent: true,
        primaryType: 'email',
      }));

      await SentRemindersPatients.create({
        sentRemindersId: sentReminder1.id,
        patientId,
        appointmentId: appts[0].id,
      });

      const confirm = await checkConfirmAttempts(appts[0].id);

      expect(confirm.sms).toBe(0);
      expect(confirm.phone).toBe(0);
      expect(confirm.email).toBe(1);
    });

    test('should have no reminder - its confirmed', async () => {
      const reminder1 = await Reminder.create({
        accountId, primaryType: 'sms', lengthSeconds: 1086410, interval: '6 months',
      });
      const appts = await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);
      await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        appointmentId: appts[0].id,
        lengthSeconds: 1086410,
        isSent: true,
        isConfirmed: true,
        primaryType: 'email',
      }));

      const confirm = await checkConfirmAttempts(appts[0].id);

      expect(confirm).toBe(null);
    });

    test('should have no reminder - its not isConfirmable', async () => {
      const reminder1 = await Reminder.create({
        accountId, primaryType: 'sms', lengthSeconds: 1086410, interval: '6 months',
      });
      const appts = await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        appointmentId: appts[0].id,
        lengthSeconds: 1086410,
        isSent: true,
        isConfirmable: false,
        primaryType: 'email',
      }));

      const confirm = await checkConfirmAttempts(appts[0].id);

      expect(confirm).toBe(null);
    });
  });

  describe('#allInsights - grouping all insights together', () => {
    test('should be a function', () => {
      expect(typeof allInsights).toBe('function');
      expect(typeof checkConfirmAttempts).toBe('function');
    });

    beforeEach(async () => {

    });

    afterEach(async () => {
      await wipeModel(SentReminder);
      await wipeModel(Reminder);
      await wipeModel(Appointment);
      await wipeModel(Patient);
      await wipeModel(Family);
    });

    test('should return one insight with missingEmail and Mobile to be false', async () => {
      const time = moment(date(2017, 7, 5, 7));


      const newPatId = 'a2be3674-d046-4cde-af5f-c95a2ce8bab2';

      const family = await Family.create(makeFamilyData({ headId: newPatId }));
      const patient = await Patient.create(makePatientData({
        id: newPatId,
        firstName: 'WHAT',
        lastName: 'NO',
        familyId: family.id,
        pmsId: '123',
      }));

      await Patient.create(makePatientData({
        firstName: 'When',
        lastName: 'NO',
        familyId: family.id,
        pmsId: '124',
        dueForHygieneDate: time.clone().subtract(7, 'months')._d,
      }));

      const reminder1 = await Reminder.create({
        accountId, primaryType: 'sms', lengthSeconds: 1086410, interval: '6 months',
      });

      const appts = await Appointment.bulkCreate([
        makeApptData({ patientId: patient.id, ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        appointmentId: appts[0].id,
        lengthSeconds: 1086410,
        isSent: true,
      }));

      const allInsightsResult = await allInsights(accountId, date(2017, 7, 5, 7), dates(2017, 7, 5, 9));
      expect(allInsightsResult.length).toBe(1);
    });
  });
});
