
import { v4 as uuid } from 'uuid';
import { tzIso, tzTimeHS } from '@carecru/isomorphic';
import { Account, DailySchedule, WeeklySchedule } from 'CareCruModels';
import { saveWeeklyScheduleWithDefaults } from '../../_models/WeeklySchedule';
import fetchAndComputeFinalDailySchedules from './fetchAndComputeFinalDailySchedules';
import { seedTestUsers, accountId } from '../../../tests/util/seedTestUsers';
import { wipeAllModels } from '../../../tests/util/wipeModel';

const TZ = 'America/Edmonton';
const d = date => tzIso(date, TZ);
const t = date => tzTimeHS(date, TZ);

const weeklyScheduleId = uuid();
const schedule = {
  id: weeklyScheduleId,
  accountId,
  sunday: {
    isClosed: true,
    startTime: '1970-01-31T08:00:00.000Z', // CLOSED
    endTime: '1970-01-31T08:00:00.000Z',
  },
  monday: {
    isClosed: false,
    startTime: '1970-01-31T15:00:00.000Z', // 8:00am
    endTime: '1970-01-31T24:00:00.000Z', // 5:00pm
  },
  tuesday: {
    isClosed: false,
    startTime: '1970-01-31T16:30:00.000Z', // 9:30am
    endTime: '1970-02-01T01:30:00.000Z', // 6:30pm
  },
  wednesday: {
    isClosed: false,
    startTime: '1970-01-31T15:30:00.000Z', // 8:30am
    endTime: '1970-02-01T00:30:00.000Z', // 5:30pm
  },
  thursday: {
    isClosed: false,
    startTime: '1970-01-31T15:00:00.000Z', // 8:00am
    endTime: '1970-01-31T19:00:00.000Z', // 12:00am
  },
  friday: {
    isClosed: true,
    startTime: '1970-01-31T08:00:00.000Z', // CLOSED
    endTime: '1970-01-31T08:00:00.000Z',
  },
  saturday: {
    isClosed: true,
    startTime: '1970-01-31T08:00:00.000Z', // CLOSED
    endTime: '1970-01-31T08:00:00.000Z',
  },
};

const dailySchedules = [
  {
    accountId,
    date: '2018-12-24',
    isClosed: false,
    startTime: '1970-01-31T16:00:00.000Z', // 9:00am
    endTime: '1970-01-31T19:00:00.000Z', // 12:00pm
  },
  {
    accountId,
    date: '2018-12-25',
    isClosed: true,
    startTime: '1970-01-31T08:00:00.000Z', // CLOSED
    endTime: '1970-01-31T08:00:00.000Z',
  },
];

describe('Schedule Library', () => {
  describe('#fetchAndComputeFinalDailySchedules', () => {
    beforeEach(async () => {
      await wipeAllModels();
      await seedTestUsers();
      await saveWeeklyScheduleWithDefaults(schedule, WeeklySchedule);
      await Account.update({ weeklyScheduleId }, { where: { id: accountId } });
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    test('should be a function', () => {
      expect(typeof fetchAndComputeFinalDailySchedules).toBe('function');
    });

    test('should return the default schedules for the given days', async () => {
      const startDate = d('2018-12-24'); // Monday, December 24th 2018
      const endDate = d('2018-12-28'); // Friday, December 28th 2018
      const daySchedules = await fetchAndComputeFinalDailySchedules({ accountId, startDate, endDate });
      expect(Object.keys(daySchedules).length).toBe(5);
      // Monday, December 24th 2018
      expect(daySchedules['2018-12-24'].isClosed).toBe(false);
      expect(t(daySchedules['2018-12-24'].startTime)).toBe('08:00');
      expect(t(daySchedules['2018-12-24'].endTime)).toBe('17:00');
      // Tuesday, December 25th 2018
      expect(daySchedules['2018-12-25'].isClosed).toBe(false);
      expect(t(daySchedules['2018-12-25'].startTime)).toBe('09:30');
      expect(t(daySchedules['2018-12-25'].endTime)).toBe('18:30');
      // Wednesday, December 26th 2018
      expect(daySchedules['2018-12-26'].isClosed).toBe(false);
      expect(t(daySchedules['2018-12-26'].startTime)).toBe('08:30');
      expect(t(daySchedules['2018-12-26'].endTime)).toBe('17:30');
      // Thursday, December 27th 2018
      expect(daySchedules['2018-12-27'].isClosed).toBe(false);
      expect(t(daySchedules['2018-12-27'].startTime)).toBe('08:00');
      expect(t(daySchedules['2018-12-27'].endTime)).toBe('12:00');
      // Friday, December 28th 2018
      expect(daySchedules['2018-12-28'].isClosed).toBe(true);
    });

    test('should return the same as above but overrides for monday and tuesday', async () => {
      // Add the dailySchedule overrides for the account
      await DailySchedule.bulkCreate(dailySchedules);
      const startDate = d('2018-12-24'); // Monday, December 24th 2018
      const endDate = d('2018-12-28'); // Friday, December 28th 2018
      const daySchedules = await fetchAndComputeFinalDailySchedules({ accountId, startDate, endDate });
      expect(Object.keys(daySchedules).length).toBe(5);
      // Monday, December 24th 2018
      expect(daySchedules['2018-12-24'].isClosed).toBe(false);
      expect(t(daySchedules['2018-12-24'].startTime)).toBe('09:00');
      expect(t(daySchedules['2018-12-24'].endTime)).toBe('12:00');
      // Tuesday, December 25th 2018
      expect(daySchedules['2018-12-25'].isClosed).toBe(true);
      // Wednesday, December 26th 2018
      expect(daySchedules['2018-12-26'].isClosed).toBe(false);
      expect(t(daySchedules['2018-12-26'].startTime)).toBe('08:30');
      expect(t(daySchedules['2018-12-26'].endTime)).toBe('17:30');
      // Thursday, December 27th 2018
      expect(daySchedules['2018-12-27'].isClosed).toBe(false);
      expect(t(daySchedules['2018-12-27'].startTime)).toBe('08:00');
      expect(t(daySchedules['2018-12-27'].endTime)).toBe('12:00');
      // Friday, December 28th 2018
      expect(daySchedules['2018-12-28'].isClosed).toBe(true);
    });
  });
});
