
import { tzIso } from '@carecru/isomorphic';
import { generateIsActiveReminder } from '../../../../../server/lib/reminders/helpers';

const TIME_ZONE = 'America/Vancouver';
const td = d => tzIso(d, TIME_ZONE);
const makeAccount = (data = {}) => ({
  timezone: TIME_ZONE,
  ...data,
});

const makeReminder = (data = {}) => ({
  isDaily: false,
  dailyRunTime: null,
  startTime: null,
  ...data,
});

describe('RemindersList Calculation Library', () => {
  describe('#generateIsActiveReminder', () => {
    test('should be a function', () => {
      expect(typeof generateIsActiveReminder).toBe('function');
    });

    test('should return true for a reminder that isDaily=false and startTime is null', async () => {
      const startDate = td('2018-08-15 07:00');
      const endDate = td('2018-08-15 11:00');
      expect(
        generateIsActiveReminder({
          account: makeAccount(),
          startDate,
          endDate
        })(makeReminder())
      ).toBe(true);
    });

    test('should return false for a reminder that isDaily=true and dailyRunTime is outside of range', async () => {
      const startDate = td('2018-08-15 07:00');
      const endDate = td('2018-08-15 11:00');
      expect(
        generateIsActiveReminder({
          account: makeAccount(),
          startDate,
          endDate
        })(makeReminder({
          isDaily: true,
          dailyRunTime: '06:00:00',
        }))
      ).toBe(false);
    });

    test('should return true for a reminder that isDaily=true and dailyRunTime is inside of range', async () => {
      const startDate = td('2018-08-15 07:00');
      const endDate = td('2018-08-15 11:00');
      expect(
        generateIsActiveReminder({
          account: makeAccount(),
          startDate,
          endDate
        })(makeReminder({
          isDaily: true,
          dailyRunTime: '08:00:00',
        }))
      ).toBe(true);
    });

    test('should return true for a reminder that isDaily=true and dailyRunTime is inside of range', async () => {
      const startDate = td('2018-08-15 07:00');
      const endDate = td('2018-08-15 11:00');
      expect(
        generateIsActiveReminder({
          account: makeAccount(),
          startDate,
          endDate
        })(makeReminder({
          isDaily: true,
          dailyRunTime: '08:00:00',
        }))
      ).toBe(true);
    });
  });
});

