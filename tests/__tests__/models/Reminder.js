
import { Account, Reminder } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize } from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const makeData = (data = {}) => (Object.assign({
  accountId,
  primaryType: 'sms',
  lengthSeconds: 7200,
}, data));

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Reminder', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Reminder);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(Reminder);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a Reminder without id provided', async () => {
      const data = makeData();
      const recall = await Reminder.create(data);
      expect(omitProperties(recall.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should throw error for no accountId provided', async () => {
      const data = makeData({ accountId: undefined });
      try {
        await Reminder.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      try {
        await Reminder.create(data);
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
      const { id } = await Reminder.create(makeData());
      const recall = await Reminder.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(recall.accountId).toBe(recall.account.id);
    });
  });
});
