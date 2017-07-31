
import { Account, SyncClientError } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize } from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const makeData = (data = {}) => (Object.assign({
  syncId: 111,
  accountId,
  operation: 'sync',
}, data));

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/SyncClientError', () => {
  beforeEach(async () => {
    await wipeModelSequelize(SyncClientError);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(SyncClientError);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a SyncClientError without id provided', async () => {
      const data = makeData();
      const syncClientError = await SyncClientError.create(data);
      expect(omitProperties(syncClientError.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should have null values for stackTrace', async () => {
      const data = makeData();
      const syncClientError = await SyncClientError.create(data);
      expect(syncClientError.stackTrace).toBe(null);
    });

    test('should throw error for no accountId provided', async () => {
      const data = makeData({ accountId: undefined });
      try {
        await SyncClientError.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      try {
        await SyncClientError.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeForeignKeyConstraintError');
      }
    });
  });

  describe('Relations', () => {
    test('should be able to fetch account relationship', async () =>  {
      const { id } = await SyncClientError.create(makeData());
      const syncClientError = await SyncClientError.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(syncClientError.accountId).toBe(syncClientError.account.id);
    });
  });
});
