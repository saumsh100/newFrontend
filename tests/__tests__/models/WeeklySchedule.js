
import { Account, WeeklySchedule } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';

async function wipeWeeklyScheduleTable() {
  await WeeklySchedule.destroy({
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

describe('models/WeeklySchedule', () => {
  beforeEach(async () => {
    await wipeWeeklyScheduleTable();
    await wipeAccountTable();
  });

  afterAll(async () => {
    await wipeWeeklyScheduleTable();
    await wipeAccountTable();
  });

  describe('Data Validation', () => {
    test('should be able to save a WeeklySchedule without id provided', async () => {
      const data = makeData();
      await Account.create(makeAccountData());
      const weeklySchedule = await WeeklySchedule.create(data);
      expect(omitProperties(weeklySchedule.get({ plain: true }), ['id'])).toMatchSnapshot();
    });

    test('should have null values for startDate', async () => {
      const data = makeData();
      await Account.create(makeAccountData());
      const weeklySchedule = await WeeklySchedule.create(data);
      expect(weeklySchedule.startDate).toBe(null);
    });

    test('should throw error for no accountId provided', async () => {
      const data = makeData({ accountId: undefined });
      await Account.create(makeAccountData());
      try {
        await WeeklySchedule.create(data);
        throw new Error(fail);
      } catch (err) {
        expect(err.name).toEqual('SequelizeValidationError');
      }
    });

    test('should fail if accountId does not reference an existing account', async () => {
      const data = makeData({ accountId: fakeAccountId });
      try {
        await WeeklySchedule.create(data);
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
      const { id } = await WeeklySchedule.create(makeData());

      const weeklySchedule = await WeeklySchedule.findOne({
        where: { id },
        include: [
          {
            model: Account,
            as: 'account',
          },
        ],
      });

      expect(weeklySchedule.accountId).toBe(weeklySchedule.account.id);
    });
  });
});
