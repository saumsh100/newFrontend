
import { Account, Appointment, Patient, Practitioner, Reminder, SentReminder } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize } from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

// This is dependant on alot of data!

const patientId = '88a2d812-3a4c-454c-9286-628556563bdc';
const makePatientData = (data = {}) => Object.assign({
  id: patientId,
  firstName: 'Justin',
  lastName: 'Sharp',
  accountId,
}, data);

const reminderId = '99a2d812-3a4c-454c-9286-628556563bdc';
const makeReminderData = (data = {}) => Object.assign({
  id: reminderId,
  accountId,
  primaryType: 'sms',
  lengthSeconds: 7200,
}, data);

const practitionerId = '11a2d812-3a4c-454c-9286-628556563bdc';
const makePractitionerData = (data = {}) => Object.assign({
  id: practitionerId,
  firstName: 'Test',
  lastName: 'Practitioner',
  accountId,
}, data);

const appointmentId = '22a2d812-3a4c-454c-9286-628556563bdc';
const makeAppointmentData = (data = {}) => Object.assign({
  id: appointmentId,
  accountId,
  practitionerId,
  startDate: (new Date(2017, 1, 1, 8, 30)).toISOString(),
  endDate: (new Date(2017, 1, 1, 9, 30)).toISOString(),
});

const makeData = (data = {}) => Object.assign({
  accountId,
  reminderId,
  patientId,
  appointmentId,
  primaryType: 'sms',
  lengthSeconds: 7200,
}, data);

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/SentReminder', () => {
  beforeEach(async () => {
    await wipeModelSequelize(SentReminder);
    await wipeModelSequelize(Reminder);
    await wipeModelSequelize(Patient);
    await wipeModelSequelize(Appointment);
    await wipeModelSequelize(Practitioner);
    await seedTestAccountsSequelize();
    await Practitioner.create(makePractitionerData());
    await Appointment.create(makeAppointmentData());
  });

  afterAll(async () => {
    await wipeModelSequelize(SentReminder);
    await wipeModelSequelize(Reminder);
    await wipeModelSequelize(Patient);
    await wipeModelSequelize(Appointment);
    await wipeModelSequelize(Practitioner);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a SentReminder without id provided', async () => {
      const data = makeData();
      await Reminder.create(makeReminderData());
      await Patient.create(makePatientData());
      const sentReminder = await SentReminder.create(data);
      expect(omitProperties(sentReminder.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should throw error for no accountId provided', async () => {
      const data = makeData({ accountId: undefined });
      await Reminder.create(makeReminderData());
      await Patient.create(makePatientData());
      try {
        await SentReminder.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      await Reminder.create(makeReminderData());
      await Patient.create(makePatientData());
      try {
        await SentReminder.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeForeignKeyConstraintError');
      }
    });
  });

  describe('Relations', () => {
    test('should be able to fetch account relationship', async () =>  {
      await Reminder.create(makeReminderData());
      await Patient.create(makePatientData());
      const { id } = await SentReminder.create(makeData());
      const sentReminder = await SentReminder.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(sentReminder.accountId).toBe(sentReminder.account.id);
    });
  });
});
