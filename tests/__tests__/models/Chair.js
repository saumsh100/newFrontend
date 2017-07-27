
import { Account, Chair } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize } from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const makeData = (data = {}) => (Object.assign({
  name: 'Test Chair',
  accountId,
}, data));

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Chair', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Chair);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(Chair);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a Chair without id provided', async () => {
      const data = makeData();
      const chair = await Chair.create(data);
      expect(omitProperties(chair.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should have null values for description', async () => {
      const data = makeData();
      const chair = await Chair.create(data);
      expect(chair.description).toBe(null);
    });

    test('should throw error for no name provided', async () => {
      const data = makeData({ name: undefined });
      try {
        await Chair.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      try {
        await Chair.create(data);
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
      const { id } = await Chair.create(makeData());
      const chair = await Chair.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(chair.accountId).toBe(chair.account.id);
    });
  });
});
