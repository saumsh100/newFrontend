
import { User, Permission } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId, enterpriseId } from '../../util/seedTestAccounts';

const activeAccountId = accountId;
const permissionId = '1962893f-a1fc-4230-a034-7ad50199cc98';
const makePermissionData = (data = {}) => (Object.assign({
  id: permissionId,
  role: 'MANAGER',
}));

const makeData = (data = {}) => (Object.assign({
  firstName: 'Harvey',
  lastName: 'Dentest',
  username: 'user@test.com',
  password: 'test',
  mobilePhoneNumber: '+18887774444',
  activeAccountId,
  enterpriseId,
  permissionId,
}, data));

const fail = 'Your code should be failing but it is passing';

describe('models/User', () => {
  beforeEach(async () => {
    await wipeModelSequelize(User);
    await wipeModelSequelize(Permission);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(User);
    await wipeModelSequelize(Permission);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a User without id provided', async () => {
      const data = makeData();
      await Permission.create(makePermissionData());
      const user = await User.create(data);
      expect(omitProperties(user.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should throw error for bad email format', async () => {
      const data = makeData({ username: 'userTest' });
      try {
        await User.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.message).toEqual(expect.stringContaining('Validation error'));
      }
    });

    test('should NOT throw Unique Field error', async () => {
      // Save one, then try saving another with same data
      await Permission.create(makePermissionData());
      await User.create(makeData());
      const data = makeData({ username: 'other@guy.ca' });
      await User.create(data);
    });

    test('should throw Unique Field error for diff accountId', async () => {
      const data = makeData();
      await Permission.create(makePermissionData());
      await User.create(data);
      try {
        await User.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeUniqueConstraintError');
        expect(err.message).toEqual(expect.stringContaining('Validation error'));
      }
    });

    test('should throw error for firstName cannot be null', async () => {
      const data = makeData({ firstName: undefined });
      try {
        await User.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.message).toEqual(expect.stringContaining('notNull Violation'));
      }
    });
  });
});
