
import uuid from 'uuid';
import { setDateToTimezone } from '@carecru/isomorphic';
import { Account, WeeklySchedule } from 'CareCruModels';
import getNextStartTime from './handleNextStartTimeOpenDays';
import { accountId, seedTestUsers } from '../../../tests/util/seedTestUsers';
import { wipeAllModels } from '../../../tests/util/wipeModel';
import fetchAndComputeFinalDailySchedules from './fetchAndComputeFinalDailySchedules';
import { saveWeeklyScheduleWithDefaults } from '../../_models/WeeklySchedule';

const weeklyScheduleId = uuid();
const schedule = {
  id: weeklyScheduleId,
  startDate: '2018-04-02T00:00:00.000Z',
  isAdvanced: false,
  monday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T21:00:00.000Z',
    pmsScheduleId: null,
  },
  tuesday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T15:10:00.000Z',
    pmsScheduleId: null,
  },
  wednesday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  thursday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T15:00:00.000Z',
    pmsScheduleId: null,
  },
  friday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  saturday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: true,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  sunday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: true,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  pmsId: '23',
  weeklySchedules: null,
};

describe('Schedule Utilities', () => {
  describe('closed Practice', () => {
    beforeAll(async () => {
      await seedTestUsers();
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    it('practice is closed', async () => {
      const account = await Account.findByPk(accountId);
      await expect(() => getNextStartTime(account)).toThrow('Practice has no open office hours');
    });
  });

  describe('next startTime open day', () => {
    beforeAll(async () => {
      await seedTestUsers();
      await saveWeeklyScheduleWithDefaults(schedule, WeeklySchedule);
      await Account.update({ weeklyScheduleId }, { where: { id: accountId } });
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    it('find next after weekends', async () => {
      const account = await Account.findByPk(accountId);
      const scheduleList = await fetchAndComputeFinalDailySchedules({
        accountId,
        timezone: account.timezone,
        startDate: setDateToTimezone('2018-11-03T08:00:00.000Z', account.timezone),
        endDate: setDateToTimezone('2018-12-03T08:00:00.000Z', account.timezone),
      });
      const result = getNextStartTime(account, scheduleList);

      expect(result.startTime).toBe('2018-11-05T15:00:00.000Z');
    });

    it('current (friday) is opening during the day', async () => {
      const account = await Account.findByPk(accountId);
      const scheduleList = await fetchAndComputeFinalDailySchedules({
        accountId,
        timezone: account.timezone,
        startDate: setDateToTimezone('2018-11-02T08:00:00.000Z', account.timezone),
        endDate: setDateToTimezone('2018-12-03T08:00:00.000Z', account.timezone),
      });
      const result = getNextStartTime(account, scheduleList);

      expect(result.openAtTheMoment).toBe(false);
      expect(result.startTime).toBe('2018-11-02T15:00:00.000Z');
    });

    it('is opened at the moment', async () => {
      const account = await Account.findByPk(accountId);
      jest.spyOn(Date, 'now').mockReturnValue(setDateToTimezone('2018-11-02T16:00:00.000Z', account.timezone).toDate().getTime());
      const scheduleList = await fetchAndComputeFinalDailySchedules({
        accountId,
        timezone: account.timezone,
        startDate: setDateToTimezone('2018-11-02T16:00:00.000Z', account.timezone),
        endDate: setDateToTimezone('2018-12-03T08:00:00.000Z', account.timezone),
      });
      const result = getNextStartTime(account, scheduleList);

      expect(result.openAtTheMoment).toBe(true);
      expect(result.startTime).toBe('2018-11-02T15:00:00.000Z');
      Date.now.mockClear();
    });

    it('next day is open', async () => {
      const account = await Account.findByPk(accountId);
      const scheduleList = await fetchAndComputeFinalDailySchedules({
        accountId,
        timezone: account.timezone,
        startDate: setDateToTimezone('2018-11-08T23:55:00.000Z', account.timezone),
        endDate: setDateToTimezone('2018-12-07T08:00:00.000Z', account.timezone),
      });
      const result = getNextStartTime(account, scheduleList);

      expect(result.startTime).toBe('2018-11-09T15:00:00.000Z');
    });

    it('endTime has a small window of time (15 minutes)', async () => {
      const account = await Account.findByPk(accountId);
      const scheduleList = await fetchAndComputeFinalDailySchedules({
        accountId,
        timezone: account.timezone,
        startDate: setDateToTimezone('2018-11-06T15:05:00.000Z', account.timezone),
        endDate: setDateToTimezone('2018-12-07T08:00:00.000Z', account.timezone),
      });
      const result = getNextStartTime(account, scheduleList);

      expect(result.startTime).toBe('2018-11-07T15:00:00.000Z');
    });

    it('both start and endtime have the same value', async () => {
      const account = await Account.findByPk(accountId);
      const scheduleList = await fetchAndComputeFinalDailySchedules({
        accountId,
        timezone: account.timezone,
        startDate: setDateToTimezone('2018-11-08T15:00:00.000Z', account.timezone),
        endDate: setDateToTimezone('2018-12-07T08:00:00.000Z', account.timezone),
      });
      const result = getNextStartTime(account, scheduleList);

      expect(result.startTime).toBe('2018-11-09T15:00:00.000Z');
    });
  });

  describe('with buffer', () => {
    beforeAll(async () => {
      await seedTestUsers();
      await saveWeeklyScheduleWithDefaults(schedule, WeeklySchedule);
      await Account.update({
        weeklyScheduleId,
        canAutoRespondOutsideOfficeHours: true,
        bufferBeforeOpening: '-30 minutes',
        bufferAfterClosing: '30 minutes',
      }, { where: { id: accountId } });
    });

    afterAll(async () => {
      await wipeAllModels();
    });

    it('adds a buffer for the next working day', async () => {
      const account = await Account.findByPk(accountId);
      const scheduleList = await fetchAndComputeFinalDailySchedules({
        accountId,
        timezone: account.timezone,
        startDate: setDateToTimezone('2018-11-03T08:00:00.000Z', account.timezone),
        endDate: setDateToTimezone('2018-12-03T08:00:00.000Z', account.timezone),
      });
      const result = getNextStartTime(account, scheduleList);

      expect(result.startTime).toBe('2018-11-05T14:30:00.000Z');
    });

    it('consider practice as open when within buffer', async () => {
      const account = await Account.findByPk(accountId);
      jest.spyOn(Date, 'now').mockReturnValue(setDateToTimezone('2018-11-05T15:15:00.000Z', account.timezone).toDate().getTime());
      const scheduleList = await fetchAndComputeFinalDailySchedules({
        accountId,
        timezone: account.timezone,
        startDate: setDateToTimezone('2018-11-05T15:00:00.000Z', account.timezone),
        endDate: setDateToTimezone('2018-12-03T08:00:00.000Z', account.timezone),
      });
      const result = getNextStartTime(account, scheduleList);

      expect(result.openAtTheMoment).toBe(true);
      expect(result.startTime).toBe('2018-11-05T14:30:00.000Z');
      Date.now.mockClear();
    });
  });
});
