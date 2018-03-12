
import {
  Account,
  Reminder,
} from '../../../../../server/_models';
import {
  fetchActiveReminders,
} from '../../../../../server/lib/reminders/helpers';
import { tzIso } from '../../../../../server/util/time';
import { wipeAllModels } from '../../../../_util/wipeModel';
import { seedTestUsers, accountId } from '../../../../_util/seedTestUsers';

const TIME_ZONE = 'America/Vancouver';
const td = d => tzIso(d, TIME_ZONE);
const account = { id: accountId, timezone: TIME_ZONE };

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
      expect(typeof fetchActiveReminders).toBe('function');
    });

    let reminders;
    beforeEach(async () => {
      // 24 hour sms Reminder
      reminders = await Reminder.bulkCreate([
        {accountId, primaryTypes: ['sms'], interval: '2 hours'},
        {accountId, primaryTypes: ['sms'], interval: '2 days', isDaily: true, dailyRunTime: '11:00:00' },
      ]);
    });

    test('should return 1 reminder, the daily one is not in the date range', async () => {
      const startDate = td('2017-07-05 07:00');
      const endDate = td('2017-07-05 08:00');
      const activeReminders = await fetchActiveReminders({ account, startDate, endDate });
      expect(activeReminders.length).toBe(1);
      expect(activeReminders[0].id).toBe(reminders[0].id);
    });

    test('should return 2 reminder, the daily one is in the date range', async () => {
      const startDate = td('2017-07-05 07:00');
      const endDate = td('2017-07-05 18:00');
      const activeReminders = await fetchActiveReminders({ account, startDate, endDate });
      expect(activeReminders.length).toBe(2);
      expect(activeReminders[0].id).toBe(reminders[0].id);
      expect(activeReminders[1].id).toBe(reminders[1].id);
    });

    test('should return 1 reminder because the isDailyReminder\'s runTime is not in bounds', async () => {
      const startDate = td('2017-07-05 07:00');
      const endDate = td('2017-07-05 11:00');
      const activeReminders = await fetchActiveReminders({ account, startDate, endDate });
      expect(activeReminders.length).toBe(1);
      expect(activeReminders[0].id).toBe(reminders[0].id);
    });
  });
});

