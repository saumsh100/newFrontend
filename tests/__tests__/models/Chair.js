
import { Account, Chair } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';

async function wipeChairTable() {
  await Chair.destroy({
    where: {},
    truncate: true,
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
  name: 'Test Chair',
  accountId,
}, data));

const enterpriseId = 'ef3c578f-c228-4a25-8388-90ee9a0c9eb4';
const makeAccountData = (data = {}) => (Object.assign({
  id: accountId,
  name: 'Test Account',
  enterpriseId,
}, data));

const fakeAccountId = 'f23151a6-091e-43db-8856-7e547c171754';
const fail = 'Your code should be failing but it is passing';

describe('models/Chair', () => {
  beforeEach(async () => {
    await wipeChairTable();
    await wipeAccountTable();
  });

  afterAll(async () => {
    await wipeChairTable();
    await wipeAccountTable();
  });

  describe('Data Validation', () => {
    test('should be able to save a Chair without id provided', async () => {
      const data = makeData();
      await Account.create(makeAccountData());
      const chair = await Chair.create(data);
      expect(omitProperties(chair.dataValues, ['id'])).toMatchSnapshot();
    });

    test('should have null values for description', async () => {
      const data = makeData();
      await Account.create(makeAccountData());
      const enterprise = await Chair.create(data);
      expect(enterprise.description).toBe(null);
    });

    test('should throw error for no name provided', async () => {
      const data = makeData({ name: undefined });
      await Account.create(makeAccountData());
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
      await wipeAccountTable();
    });

    test('should be able to fetch account relationship', async () =>  {
      await Account.create(makeAccountData());
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
