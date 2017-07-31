
import { Account, Call } from '../../../server/_models';
import { omitProperties } from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const makeData = (data = {}) => Object.assign({
  id: 'CallRailUniqueId',
  accountId,
  destinationNum: '+17807807800',
}, data);

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Call', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Call);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(Call);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a Call without id provided', async () => {
      const data = makeData();
      const call = await Call.create(data);
      expect(omitProperties(call.get({ plain: true }))).toMatchSnapshot();
    });

    test('should have null values for patientId', async () => {
      const data = makeData();
      const call = await Call.create(data);
      expect(call.patientId).toBe(null);
    });

    test('should throw error for no accountId provided', async () => {
      const data = makeData({ accountId: undefined });
      try {
        await Call.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      try {
        await Call.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeForeignKeyConstraintError');
      }
    });
  });

  describe('Relations', () => {
    test('should be able to fetch account relationship', async () =>  {
      const { id } = await Call.create(makeData());
      const call = await Call.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(call.accountId).toBe(call.account.id);
    });

    // TODO: add rest of relations tests!
  });
});
