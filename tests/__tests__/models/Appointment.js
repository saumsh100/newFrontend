
import { Account, Appointment, Chair, Practitioner } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize } from '../../util/wipeModel';
import { seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const practitionerId = '88a2d812-3a4c-454c-9286-628556563bdc';
const makeData = (data = {}) => (Object.assign({
  accountId,
  practitionerId,
  startDate: (new Date(2017, 1, 1, 8, 30)).toISOString(),
  endDate: (new Date(2017, 1, 1, 9, 30)).toISOString(),
}, data));

const makePractitionerData = (data = {}) => Object.assign({
  id: practitionerId,
  firstName: 'Test',
  lastName: 'Practitioner',
  accountId,
}, data);

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Appointment', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Appointment);
    await wipeModelSequelize(Practitioner);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(Appointment);
    await wipeModelSequelize(Practitioner);
    await seedTestAccountsSequelize();
  });

  describe('Data Validation', () => {
    test('should be able to save a Appointment without id provided', async () => {
      const data = makeData();
      await Practitioner.create(makePractitionerData());
      const appointment = await Appointment.create(data);
      expect(omitProperties(appointment.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should have default values', async () => {
      const data = makeData();
      await Practitioner.create(makePractitionerData());
      const appointment = await Appointment.create(data);
      expect(appointment.isDeleted).toBe(false);
      expect(appointment.isPatientConfirmed).toBe(false);
    });

    test('should throw error for no startDate provided', async () => {
      const data = makeData({ startDate: undefined });
      await Practitioner.create(makePractitionerData());
      try {
        await Appointment.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      try {
        await Appointment.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeForeignKeyConstraintError');
      }
    });
  });

  describe('Relations', () => {
    beforeEach(async () => {
      await seedTestAccountsSequelize();
    });

    test('should be able to fetch account relationship', async () =>  {
      await Practitioner.create(makePractitionerData());
      const { id } = await Appointment.create(makeData());

      const appointment = await Appointment.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(appointment.accountId).toBe(appointment.account.id);
    });

    test('should not fail if you are trying to join a chair if chairId is null', async () =>  {
      await Practitioner.create(makePractitionerData());
      const { id } = await Appointment.create(makeData());

      const a = await Appointment.findOne({
        where: { id },
        include: [
          {
            model: Chair,
            as: 'chair',
          },
        ],
      });

      expect(a.chair).toBe(null);
    });
  });

  describe('#batchSave', () => {
    test('should be able to save 2 appointments', async () => {
      await Practitioner.create(makePractitionerData());
      const appts = await Appointment.batchSave([
        makeData(),
        makeData(),
      ]);

      expect(appts.length).toBe(2);
    });

    test('should fail validation for 1 and save the other', async () => {
      await Practitioner.create(makePractitionerData());
      try {
        await Appointment.batchSave([
          makeData(),
          makeData({ practitionerId: null }),
          makeData({ startDate: null }),
        ]);
      } catch ({ docs, errors }) {
        expect(docs.length).toBe(1);
        expect(errors.length).toBe(2);
        expect(errors[0].name).toBe('SequelizeValidationError');
        expect(errors[1].name).toBe('SequelizeValidationError');
      }
    });
  });
});
