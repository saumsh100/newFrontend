
import { Account, Family, Patient } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize } from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const makeData = (data = {}) => (Object.assign({
  accountId,
}, data));

const makePatientData = (data = {}) => Object.assign({
  accountId,
  firstName: 'Test',
  lastName: 'Patient',
}, data);

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Family', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Family);
    await wipeModelSequelize(Patient);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(Family);
    await wipeModelSequelize(Patient);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a Family without id provided', async () => {
      const data = makeData();
      const family = await Family.create(data);
      expect(omitProperties(family.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should have null value for pmsId', async () => {
      const data = makeData();
      const family = await Family.create(data);
      expect(family.pmsId).toBe(null);
    });

    test('should throw error for no accountId provided', async () => {
      const data = makeData({ accountId: undefined });
      try {
        await Family.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      try {
        await Family.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeForeignKeyConstraintError');
      }
    });
  });

  describe('Relations', () => {
    beforeEach(async () => {
      await wipeModelSequelize(Patient);
    });

    afterAll(async () => {
      await wipeModelSequelize(Patient);
    });

    test('should be able to fetch account relationship', async () =>  {
      const { id } = await Family.create(makeData());
      const family = await Family.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(family.accountId).toBe(family.account.id);
    });

    test('should not fail if you are trying to join a chair if chairId is null', async () =>  {
      const { id } = await Family.create(makeData());
      await Patient.bulkCreate([
        makePatientData({ familyId: id }),
        makePatientData({ familyId: id }),
      ]);

      const f = await Family.findOne({
        where: { id },
        include: [
          {
            model: Patient,
            as: 'patients',
          },
        ],
      });

      expect(f.patients.length).toBe(2);
    });
  });
});
