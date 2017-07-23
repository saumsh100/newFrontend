
import { User } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';

async function wipeUserTable() {
  await User.destroy({
    where: {},
    truncate: true,
    force: true,
  });
}

const activeAccountId = 'e13151a6-091e-43db-8856-7e547c171754';
const enterpriseId = 'ef3c578f-c228-4a25-8388-90ee9a0c9eb4';
const permissionId = '1962893f-a1fc-4230-a034-7ad50199cc98';

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
    await wipeUserTable();
  });

  afterAll(async () => {
    await wipeUserTable();
  });

  describe('Data Validation', () => {
    test('should be able to save a User without id provided', async () => {
      const data = makeData();
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
      await User.create(makeData());
      const data = makeData({ username: 'other@guy.ca' });
      await User.create(data);
    });

    test('should throw Unique Field error for diff accountId', async () => {
      const data = makeData();
      try {
        await User.create(data);
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
