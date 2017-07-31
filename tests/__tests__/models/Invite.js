
import { Invite, Enterprise } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize } from '../../util/wipeModel';
import {
  wipeTestUsers,
  seedTestUsersSequelize,
  accountId,
  enterpriseId,
  ownerUserId,
} from '../../util/seedTestUsers';

const makeData = (data = {}) => (Object.assign({
  accountId,
  sendingUserId: ownerUserId,
  enterpriseId,
  email: 'test@test.test',
}, data));

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Invite', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Invite);
    await seedTestUsersSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(Invite);
    await wipeTestUsers();
  });

  describe('Data Validation', () => {
    test('should be able to save a Invite without id provided', async () => {
      const data = makeData();
      const invite = await Invite.create(data);
      expect(omitProperties(invite.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should have null values for token', async () => {
      const data = makeData();
      const invite = await Invite.create(data);
      expect(invite.token).toBe(null);
    });

    test('should throw error for sendingUserId provided', async () => {
      const data = makeData({ sendingUserId: undefined });
      try {
        await Invite.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      try {
        await Invite.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeForeignKeyConstraintError');
      }
    });
  });

  describe('Relations', () => {
    test('should be able to fetch enterprise relationship', async () =>  {
      const { id } = await Invite.create(makeData());
      const invite = await Invite.findOne({
        where: { id },
        include: [
          {
            model: Enterprise,
            as: 'enterprise',
          },
        ],
      });

      expect(invite.enterpriseId).toBe(invite.enterprise.id);
    });
  });
});
