
import { Account, PatientUser, Request, Service } from '../../../server/_models';
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

const serviceId = '99a2d812-3a4c-454c-9286-628556563bdc';
const makeServiceData = (data = {}) => (Object.assign({
  id: serviceId,
  name: 'Test Service',
  duration: 30,
  accountId,
}, data));

const makeData = (data = {}) => (Object.assign({
  accountId,
  patientUserId,
  serviceId,
  startDate: (new Date(2017, 1, 1, 8, 30)).toISOString(),
  endDate: (new Date(2017, 1, 1, 9, 30)).toISOString(),
}, data));

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Request', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Request);
    await wipeModelSequelize(PatientUser);
    await wipeModelSequelize(Service);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(Request);
    await wipeModelSequelize(PatientUser);
    await wipeModelSequelize(Service);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a Request without id provided', async () => {
      const data = makeData();
      await Service.create(makeServiceData());
      await PatientUser.create(makePatientUserData());
      const request = await Request.create(data);
      expect(omitProperties(request.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should have null values for practitionerId', async () => {
      const data = makeData();
      await Service.create(makeServiceData());
      await PatientUser.create(makePatientUserData());
      const request = await Request.create(data);
      expect(request.practitionerId).toBe(null);
    });

    test('should throw error for accountId provided', async () => {
      const data = makeData({ accountId: undefined });
      await Service.create(makeServiceData());
      await PatientUser.create(makePatientUserData());
      try {
        await Request.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      await Service.create(makeServiceData());
      await PatientUser.create(makePatientUserData());
      try {
        await Request.create(data);
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
      await Service.create(makeServiceData());
      await PatientUser.create(makePatientUserData());
      const { id } = await Request.create(makeData());
      const request = await Request.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(request.accountId).toBe(request.account.id);
    });
  });
});
