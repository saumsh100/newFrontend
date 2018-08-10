
import { Account, SyncClientVersion } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize } from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const makeData = (data = {}) => (Object.assign({
  major: 1.2,
  minor: 1.1,
  patch: 1.13,
  build: 1.4,
  url: 'cats',
}, data));

const fail = 'Your code should be failing but it is passing';

describe('models/SyncClientVersion', () => {
  beforeEach(async () => {
    await wipeModelSequelize(SyncClientVersion);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(SyncClientVersion);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a SyncClientVersion without id provided', async () => {
      const data = makeData();
      const syncClientVersion = await SyncClientVersion.create(data);
      expect(omitProperties(syncClientVersion.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should have null values for bucket', async () => {
      const data = makeData();
      const syncClientVersion = await SyncClientVersion.create(data);
      expect(syncClientVersion.bucket).toBe(null);
    });

    test('should fail if major is not a number', async () => {
      const data = makeData({ major: [] });
      try {
        await SyncClientVersion.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeDatabaseError');
      }
    });
  });
});
