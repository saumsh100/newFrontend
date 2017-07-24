
import { Account } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';

async function wipeAccountTable() {
  await Account.destroy({
    where: {},
    truncate: true,
    force: true,
  });
}

const enterpriseId = 'ef3c578f-c228-4a25-8388-90ee9a0c9eb4';
const makeData = (data = {}) => (Object.assign({
  name: 'Test Account',
  enterpriseId,
}, data));

const fail = 'Your code should be failing but it is passing';

describe('models/Account', () => {
  beforeEach(async () => {
    await wipeAccountTable();
  });

  afterAll(async () => {
    await wipeAccountTable();
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
    test.skip('should be able to sanitize phone numbers', async () => {
      const data = makeData({ twilioPhoneNumber: '111 222 3333' });
      const account = await Account.save(data);
      expect(account.twilioPhoneNumber).toEqual('+11112223333');
    });
  });
});
