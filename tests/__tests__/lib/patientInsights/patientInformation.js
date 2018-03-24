import moment from 'moment';
import {
  Appointment,
  Patient,
  Family,
  DeliveredProcedure,
  Reminder,
  SentReminder,
} from '../../../../server/_models';
import {
  checkMobileNumber,
  checkEmail,
  allInsights,
  familyRecare,
  checkConfirmAttempts,
} from '../../../../server/lib/patientInsights/patientInformation';
import { seedTestUsers, accountId } from '../../../util/seedTestUsers';
import { seedTestPatients, patientId } from '../../../util/seedTestPatients';
import { code, seedTestProcedures, wipeTestProcedures } from '../../../util/seedTestProcedures';
import { seedTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';
import wipeModel, { wipeAllModels } from '../../../util/wipeModel';

const makeApptData = (data = {}) => Object.assign({
  accountId,
  patientId,
  practitionerId,
}, data);

const makePatientData = (data = {}) => Object.assign({
  accountId,
}, data);

const makeFamilyData = (data = {}) => Object.assign({
  accountId,
}, data);

const makeSentReminderData = (data = {}) => Object.assign({
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

describe('Patient Insights', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
    await seedTestPatients();
    await seedTestPractitioners();
    await seedTestProcedures();
  });

  afterAll(async () => {
    await wipeModel(DeliveredProcedure);
    await wipeTestProcedures();
    await wipeAllModels();
  });

  describe('#checkConfirmAttempts - returns the amount of confirm attempts by type', () => {
    test('should be a function', () => {
      expect(typeof checkMobileNumber).toBe('function');
      expect(typeof checkEmail).toBe('function');
      expect(typeof allInsights).toBe('function');
      expect(typeof familyRecare).toBe('function');
      expect(typeof checkConfirmAttempts).toBe('function');
    });

    beforeEach(async () => {

    });

    afterEach(async () => {
      await wipeModel(SentReminder);
      await wipeModel(Reminder);
      await wipeModel(Appointment);
    });

    test('should have one sms reminder - with one sms sent reminder no confirmation', async () => {
      const reminder1 = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 1086410, interval: '6 months' });
      const appts = await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        appointmentId: appts[0].id,
        lengthSeconds: 1086410,
        isSent: true,
      }));

      const confirm = await checkConfirmAttempts(appts[0].id);

      expect(confirm.sms).toBe(1);
      expect(confirm.phone).toBe(0);
      expect(confirm.email).toBe(0);
    });

    test('should have one phone reminder - with one phone sent reminder no confirmation', async () => {
      const reminder1 = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 1086410, interval: '6 months' });

      const appts = await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        appointmentId: appts[0].id,
        lengthSeconds: 1086410,
        isSent: true,
        primaryType: 'phone',
      }));

      const confirm = await checkConfirmAttempts(appts[0].id);

      expect(confirm.sms).toBe(0);
      expect(confirm.phone).toBe(1);
      expect(confirm.email).toBe(0);
    });

    test('should have one email reminder - with one email sent reminder no confirmation', async () => {
      const reminder1 = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 1086410, interval: '6 months' });
      const appts = await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        appointmentId: appts[0].id,
        lengthSeconds: 1086410,
        isSent: true,
        primaryType: 'email',
      }));

      const confirm = await checkConfirmAttempts(appts[0].id);

      expect(confirm.sms).toBe(0);
      expect(confirm.phone).toBe(0);
      expect(confirm.email).toBe(1);
    });

    test('should have no reminder - its confirmed', async () => {
      const reminder1 = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 1086410, interval: '6 months' });
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

      expect(confirm.sms).toBe(0);
      expect(confirm.phone).toBe(0);
      expect(confirm.email).toBe(0);
    });

    test('should have no reminder - its not isConfirmable', async () => {
      const reminder1 = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 1086410, interval: '6 months' });
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

      expect(confirm.sms).toBe(0);
      expect(confirm.phone).toBe(0);
      expect(confirm.email).toBe(0);
    });
  });

  describe('#familyRecare - returns the amount of confirm attempts by type', () => {
    beforeEach(async () => {

    });

    afterEach(async () => {
      await wipeModel(Patient);
      await wipeModel(Family);
    });

    test('should return none - as patientId will filter out', async () => {
      const time = moment();
      const family = await Family.create(makeFamilyData());
      const patient = await Patient.create(makePatientData({
        firstName: 'WHAT',
        lastName: 'NO',
        lastHygieneDate: time.clone().subtract(7, 'months')._d,
        familyId: family.id,
      }));

      const patientsRecare = await familyRecare(family.id, patient.id, time._d);

      expect(patientsRecare.length).toBe(0);
    });

    test('should return one - as patientId is null', async () => {
      const time = moment();

      const family = await Family.create(makeFamilyData());

      const patient = await Patient.create(makePatientData({
        firstName: 'WHAT',
        lastName: 'NO',
        dueForHygieneDate: time.clone().subtract(7, 'months')._d,
        familyId: family.id,
      }));

      const patientsRecare = await familyRecare(family.id, null, time._d);

      expect(patientsRecare.length).toBe(1);
    });

    test('should return none - hygiene only 5 months ago', async () => {
      const time = moment();
      const family = await Family.create(makeFamilyData());
      const patient = await Patient.create(makePatientData({
        firstName: 'WHAT',
        lastName: 'NO',
        dueForHygieneDate: time.clone().subtract(5, 'months')._d,
        familyId: family.id,
      }));

      const patientsRecare = await familyRecare(family.id, patient.id, time._d);

      expect(patientsRecare.length).toBe(0);
    });

    test('should return none - has an appointment', async () => {
      const time = moment();
      const family = await Family.create(makeFamilyData());
      const patient = await Patient.create(makePatientData({
        firstName: 'WHAT',
        lastName: 'NO',
        dueForHygieneDate: time.clone().subtract(7, 'months')._d,
        dueForRecallExamDate: time.clone().subtract(7, 'months')._d,
        nextApptDate: time.clone().add(7, 'months')._d,
        familyId: family.id,
      }));

      const patientsRecare = await familyRecare(family.id, patient.id, time._d);

      expect(patientsRecare.length).toBe(0);
    });
  });


  describe('#allInsights - grouping all insights together', () => {
    test('should be a function', () => {
      expect(typeof checkMobileNumber).toBe('function');
      expect(typeof checkEmail).toBe('function');
      expect(typeof allInsights).toBe('function');
      expect(typeof familyRecare).toBe('function');
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
      const family = await Family.create(makeFamilyData());
      await Patient.create(makePatientData({
        firstName: 'WHAT',
        lastName: 'NO',
        dueForHygieneDate: time.clone().subtract(7, 'months')._d,
        familyId: family.id,
      }));

      const reminder1 = await Reminder.create({ accountId, primaryType: 'sms', lengthSeconds: 1086410, interval: '6 months' });

      const appts = await Appointment.bulkCreate([
        makeApptData({ ...dates(2017, 7, 5, 8) }), // Today at 8
      ]);

      await SentReminder.create(makeSentReminderData({
        reminderId: reminder1.id,
        appointmentId: appts[0].id,
        lengthSeconds: 1086410,
        isSent: true,
      }));

      const allInsightsResult = await allInsights(accountId, date(2017, 7, 5, 7), dates(2017, 7, 5, 9));

      expect(allInsightsResult.length).toBe(1);
      expect(allInsightsResult[0].missingMobilePhone).toBe(false);
      expect(allInsightsResult[0].missingEmail).toBe(false);
    });
  });
});
