
import { Account, Enterprise } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeTestAccounts, seedTestAccountsSequelize, enterpriseId } from '../../util/seedTestAccounts';

const makeData = (data = {}) => (Object.assign({
  name: 'Test Account',
  enterpriseId,
}, data));

const fail = 'Your code should be failing but it is passing';

describe('models/Account', () => {
  beforeEach(async () => {
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a Account without id provided', async () => {
      const data = makeData();
      const account = await Account.create(data);
      expect(omitProperties(account.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should have default values', async () => {
      const data = makeData();
      const permission = await Account.create(data);
      expect(permission.canSendReminders).toBe(false);
      expect(permission.canSendRecalls).toBe(false);
    });

    test('should throw error for enterpriseId required', async () => {
      const data = makeData({ enterpriseId: undefined });
      try {
        await Account.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });
  });

  describe('Data Sanitization', () => {
    test('should be able to sanitize phone numbers', async () => {
      const data = makeData({ twilioPhoneNumber: '111 222 3333' });
      const account = await Account.create(data);
      expect(account.twilioPhoneNumber).toEqual('+11112223333');
    });
  });

  describe('Relations', () => {
    test('should be able to sanitize phone numbers', async () => {
      const data = makeData({ twilioPhoneNumber: '111 222 3333' });
      const account = await Account.create(data);
      expect(account.twilioPhoneNumber).toEqual('+11112223333');
    });
  });
});
