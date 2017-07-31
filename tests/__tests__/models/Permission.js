
import { Permission } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';

const makeData = (data = {}) => (Object.assign({
  role: 'MANAGER',
}, data));

const fail = 'Your code should be failing but it is passing';

describe('models/Permission', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Permission);
  });

  afterAll(async () => {
    await wipeModelSequelize(Permission);
  });

  describe('Data Validation', () => {
    test('should be able to save a Permission without id provided', async () => {
      const data = makeData();
      const permission = await Permission.create(data);
      expect(omitProperties(permission.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should have default values', async () => {
      const data = makeData();
      const permission = await Permission.create(data);
      expect(permission.canAccessAllAccounts).toBe(true);
    });

    test('should throw error for invalid role', async () => {
      const data = makeData({ role: 'NOT_A_ROLE' });
      try {
        await Permission.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeDatabaseError');
      }
    });
  });
});
