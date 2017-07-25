
import { Account, Chat } from '../../../server/_models';
import { omitProperties } from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';

async function wipeChatTable() {
  await Chat.destroy({
    where: {},
    force: true,
  });
}

async function wipeAccountTable() {
  await Account.destroy({
    where: {},
    force: true,
  });
}

const accountId = 'e13151a6-091e-43db-8856-7e547c171754';
const makeData = (data = {}) => (Object.assign({
  accountId,
  patientPhoneNumber: '+17807807800',
}, data));

const enterpriseId = 'ef3c578f-c228-4a25-8388-90ee9a0c9eb4';
const makeAccountData = (data = {}) => (Object.assign({
  id: accountId,
  name: 'Test Account',
  enterpriseId,
}, data));

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Chat', () => {
  beforeEach(async () => {
    await wipeChatTable();
    await wipeAccountTable();
  });

  afterAll(async () => {
    await wipeChatTable();
    await wipeAccountTable();
  });

  describe('Data Validation', () => {
    test('should be able to save a Chat without id provided', async () => {
      const data = makeData();
      await Account.create(makeAccountData());
      const chat = await Chat.create(data);
      expect(omitProperties(chat.get({ plain: true }), ['id'])).toMatchSnapshot();
    });

    test('should have null values for patientId', async () => {
      const data = makeData();
      await Account.create(makeAccountData());
      const chat = await Chat.create(data);
      expect(chat.patientId).toBe(null);
    });

    test('should throw error for no patientPhoneNumber provided', async () => {
      const data = makeData({ patientPhoneNumber: undefined });
      await Account.create(makeAccountData());
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
      await wipeAccountTable();
    });

    test('should be able to fetch account relationship', async () =>  {
      await Account.create(makeAccountData());
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
