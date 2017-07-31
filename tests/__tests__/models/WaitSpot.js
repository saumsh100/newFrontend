
import { Account, PatientUser, WaitSpot, Service } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize } from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const patientUserId = '88a2d812-3a4c-454c-9286-628556563bdc';
const makePatientUserData = (data = {}) => (Object.assign({
  id: patientUserId,
  firstName: 'Justin',
  lastName: 'Sharp',
  email: 'justin@carecru.com',
  password: '123123',
  phoneNumber: '+18887774444',
}, data));

const makeData = (data = {}) => (Object.assign({
  accountId,
  patientUserId,
  preferences: {
    mornings: true,
    afternoons: true,
    evenings: true,
    weekends: true,
    weekdays: true,
  },

  unavailableDays: [(new Date(2017, 8, 1, 7, 30)).toISOString()],
  endDate: (new Date(2017, 8, 1, 7, 30)).toISOString(),
}, data));

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/WaitSpot', () => {
  beforeEach(async () => {
    await wipeModelSequelize(WaitSpot);
    await wipeModelSequelize(PatientUser);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(WaitSpot);
    await wipeModelSequelize(PatientUser);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a WaitSpot without id provided', async () => {
      const data = makeData();
      await PatientUser.create(makePatientUserData());
      const waitspot = await WaitSpot.create(data);
      expect(omitProperties(waitspot.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should have null values for patientId', async () => {
      const data = makeData();
      await PatientUser.create(makePatientUserData());
      const waitspot = await WaitSpot.create(data);
      expect(waitspot.patientId).toBe(null);
    });

    test('should throw error for accountId provided', async () => {
      const data = makeData({ accountId: undefined });
      await PatientUser.create(makePatientUserData());
      try {
        await WaitSpot.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      await PatientUser.create(makePatientUserData());
      try {
        await WaitSpot.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeForeignKeyConstraintError');
      }
    });
  });

  describe('Relations', () => {
    test('should be able to fetch account relationship', async () =>  {
      await PatientUser.create(makePatientUserData());
      const { id } = await WaitSpot.create(makeData());
      const waitspot = await WaitSpot.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(waitspot.accountId).toBe(waitspot.account.id);
    });
  });
});
