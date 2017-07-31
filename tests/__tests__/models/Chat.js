
import { Account, Chat } from '../../../server/_models';
import { omitProperties } from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';
import { wipeTestAccounts, seedTestAccountsSequelize, accountId } from '../../util/seedTestAccounts';

const makeData = (data = {}) => (Object.assign({
  accountId,
  patientPhoneNumber: '+17807807800',
}, data));

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Chat', () => {
  beforeEach(async () => {
    await wipeModelSequelize(Chat);
    await seedTestAccountsSequelize();
  });

  afterAll(async () => {
    await wipeModelSequelize(Chat);
    await wipeTestAccounts();
  });

  describe('Data Validation', () => {
    test('should be able to save a Chat without id provided', async () => {
      const data = makeData();
      const chat = await Chat.create(data);
      expect(omitProperties(chat.get({ plain: true }), ['id'])).toMatchSnapshot();
    });

    test('should have null values for patientId', async () => {
      const data = makeData();
      const chat = await Chat.create(data);
      expect(chat.patientId).toBe(null);
    });

    test('should throw error for no patientPhoneNumber provided', async () => {
      const data = makeData({ patientPhoneNumber: undefined });
      try {
        await Chat.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      try {
        await Chat.create(data);
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
      const { id } = await Chat.create(makeData());
      const chat = await Chat.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(chat.accountId).toBe(chat.account.id);
    });

    // TODO: add rest of relations tests!
  });
});
