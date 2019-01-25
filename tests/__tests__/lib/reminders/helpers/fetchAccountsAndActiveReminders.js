
import { tzIso } from '@carecru/isomorphic';
import {
  Account,
  Address,
  Reminder,
} from '../../../../../server/_models';
import {
  fetchAccountsAndActiveReminders,
} from '../../../../../server/lib/reminders/helpers';
import { wipeAllModels } from '../../../../util/wipeModel';
import { seedTestUsers, accountId, enterpriseId } from '../../../../util/seedTestUsers';

const TIME_ZONE = 'America/Vancouver';
const td = d => tzIso(d, TIME_ZONE);

describe('RemindersList Calculation Library', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('#fetchActiveReminders', () => {
    test('should be a function', () => {
      expect(typeof fetchAccountsAndActiveReminders).toBe('function');
    });

    let accounts;
    let reminders;
    beforeEach(async () => {
      const addressId = 'cd39f7d8-fc06-11e7-8450-fea9aa178066';
      await Address.create({ id: addressId });
      accounts = await Account.bulkCreate([
        { enterpriseId, name: 'Account 1', canSendReminders: true, addressId, timezone: TIME_ZONE },
        { enterpriseId, name: 'Account 2', canSendReminders: false, addressId, timezone: TIME_ZONE },
      ]);

      // 24 hour sms Reminder
      reminders = await Reminder.bulkCreate([
        { accountId: accounts[0].id, primaryTypes: ['sms'], interval: '2 hours' },
        { accountId: accounts[0].id, primaryTypes: ['sms'], interval: '2 days' },
        { accountId: accounts[1].id, primaryTypes: ['sms'], interval: '2 hours' },
        { accountId: accounts[1].id, primaryTypes: ['sms'], interval: '2 days', isDaily: true, dailyRunTime: '11:00:00' },
      ]);
    });

    test('should return 1 account, with 2 reminders in order', async () => {
      const startDate = td('2017-07-05 07:00');
      const endDate = td('2017-07-05 08:00');
      const accountsReminders = await fetchAccountsAndActiveReminders({ startDate, endDate });
      expect(accountsReminders.length).toBe(1);
      expect(accountsReminders[0].reminders.length).toBe(2);
      expect(accountsReminders[0].reminders[0].id).toBe(reminders[0].id);
      expect(accountsReminders[0].reminders[1].id).toBe(reminders[1].id);
    });

    test('should return 2 accounts, with second account having only 1 reminder', async () => {
      await accounts[1].update({ canSendReminders: true });
      const startDate = td('2017-07-05 07:00');
      const endDate = td('2017-07-05 09:00');
      const accountsReminders = await fetchAccountsAndActiveReminders({ startDate, endDate });
      expect(accountsReminders.length).toBe(2);

      const account1 = accountsReminders.find(a => a.name === 'Account 1');
      const account2 = accountsReminders.find(a => a.name === 'Account 2');
      expect(account1.reminders.length).toBe(2);
      expect(account1.reminders[0].id).toBe(reminders[0].id);
      expect(account1.reminders[1].id).toBe(reminders[1].id);
      expect(account2.reminders.length).toBe(1);
      expect(account2.reminders[0].id).toBe(reminders[2].id);
    });

    test('should return 2 accounts, with second account having 2 reminders', async () => {
      await accounts[1].update({ canSendReminders: true });
      const startDate = td('2017-07-05 07:00');
      const endDate = td('2017-07-05 11:01');
      const accountsReminders = await fetchAccountsAndActiveReminders({ startDate, endDate });
      expect(accountsReminders.length).toBe(2);

      const account1 = accountsReminders.find(a => a.name === 'Account 1');
      const account2 = accountsReminders.find(a => a.name === 'Account 2');
      expect(account1.reminders.length).toBe(2);
      expect(account1.reminders[0].id).toBe(reminders[0].id);
      expect(account1.reminders[1].id).toBe(reminders[1].id);
      expect(account2.reminders.length).toBe(2);
      expect(account2.reminders[0].id).toBe(reminders[2].id);
      expect(account2.reminders[1].id).toBe(reminders[3].id);
    });

    test('should return 2 accounts, with second account having 1 reminders because of timezone', async () => {
      await accounts[1].update({ canSendReminders: true, timezone: 'Europe/Dublin' });
      const startDate = td('2017-07-05 07:00');
      const endDate = td('2017-07-05 11:01');
      const accountsReminders = await fetchAccountsAndActiveReminders({ startDate, endDate });

      const account1 = accountsReminders.find(a => a.name === 'Account 1');
      const account2 = accountsReminders.find(a => a.name === 'Account 2');
      expect(accountsReminders.length).toBe(2);
      expect(account1.reminders.length).toBe(2);
      expect(account1.reminders[0].id).toBe(reminders[0].id);
      expect(account1.reminders[1].id).toBe(reminders[1].id);
      expect(account2.reminders.length).toBe(1);
      expect(account2.reminders[0].id).toBe(reminders[2].id);
    });
  });
});

