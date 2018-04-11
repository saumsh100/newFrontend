/**
 * Created by sharp on 2017-03-22.
 */

const {
  time,
  breakdownTimeSlot,
  createPossibleTimeSlots,
  createIntervalsFromDailySchedule,
  getDailySchedules,
  combineDateAndTime,
  createIntervalsFromWeeklySchedule,
  isDuringEachother,
  getISOSortPredicate,
  getHoursFromInterval,
  getAvailableHours,
  sortIntervalDescPredicate,
  convertIntervalStringToObject,
  floorDateMinutes,
  ceilDateMinutes,
  mergeDateAndTimeWithZone,
  getProperDateWithZone,
} = require('../../server/util/time');

// Monday -> Friday 9 to 5 by default
const createWeeklySchedule = (custom = {}) => {
  return Object.assign(
    {},
    {
      monday: {
        isClosed: false,
        startTime: time(8, 0),
        endTime: time(17, 0),
        breaks: [],
      },
      tuesday: {
        isClosed: false,
        startTime: time(8, 0),
        endTime: time(17, 0),
        breaks: [],
      },
      wednesday: {
        isClosed: false,
        startTime: time(8, 0),
        endTime: time(17, 0),
        breaks: [],
      },
      thursday: {
        isClosed: false,
        startTime: time(8, 0),
        endTime: time(17, 0),
        breaks: [],
      },
      friday: {
        isClosed: false,
        startTime: time(8, 0),
        endTime: time(17, 0),
        breaks: [],
      },
      saturday: {
        isClosed: true,
        startTime: time(8, 0),
        endTime: time(17, 0),
        breaks: [],
      },
      sunday: {
        isClosed: true,
        startTime: time(8, 0),
        endTime: time(17, 0),
        breaks: [],
      },
    },
    custom
  );
};

// Monday -> Friday 9 to 5 by default
const createWeeklyScheduleWithBreaks = () => {
  return createWeeklySchedule({
    monday: {
      breaks: [{
        startTime: time(12, 0),
        endTime: time(1, 0),
      }],
    },
    tuesday: {
      breaks: [{
        startTime: time(12, 0),
        endTime: time(1, 0),
      }],
    },
    wednesday: {
      breaks: [{
        startTime: time(12, 0),
        endTime: time(1, 0),
      }],
    },
    thursday: {
      breaks: [{
        startTime: time(12, 0),
        endTime: time(1, 0),
      }],
    },
    friday: {
      breaks: [{
        startTime: time(12, 0),
        endTime: time(1, 0),
      }],
    },
    saturday: {
      breaks: [{
        startTime: time(12, 0),
        endTime: time(1, 0),
      }],
    },
    sunday: {
      breaks: [{
        startTime: time(12, 0),
        endTime: time(1, 0),
      }],
    },
  });
};

describe('util/time', () => {
  describe('#time', () => {
    it('should be a function', () => {
      expect(typeof time).toBe('function');
    });
  });

  describe('#getISOSortPredicate', () => {
    it('should be a function', () => {
      expect(typeof getISOSortPredicate).toBe('function');
    });

    it('should sort the array properly', () => {
      const array = [
        { startDate: (new Date(2016, 1, 4)).toISOString(), key: 1 },
        { startDate: (new Date(2015, 1, 4)).toISOString(), key: 0 },
        { startDate: (new Date(2016, 1, 5, 9, 37)).toISOString(), key: 3 },
        { startDate: (new Date(2016, 1, 5, 9, 36)).toISOString(), key: 2 },
      ];

      const sortedArray = array.sort(getISOSortPredicate('startDate'));
      sortedArray.forEach((a, i) => {
        expect(a.key).toBe(i);
      });
    })
  });

  describe('#mergeDateAndTimeWithZone', () => {
      it('should be a function', () => {
        expect(typeof mergeDateAndTimeWithZone).toBe('function');
      });

      it('should return next day as our timestamps are UTC when the date and timezone is Vancouver', () => {
        const result = mergeDateAndTimeWithZone('2018-04-02', '1970-02-01T01:00:00.000Z', 'America/Vancouver');
        expect(result).toBe('2018-04-03T01:00:00.000Z');
      });

      it('should return same day as our timestamps are UTC when the date and timezone is Vancouver, but the day is the same in utc', () => {
        const result = mergeDateAndTimeWithZone('2018-04-02', '1970-01-30T15:00:00.000Z', 'America/Vancouver');
        expect(result).toBe('2018-04-02T15:00:00.000Z');
      });
    });

  describe('#createIntervalsFromDailySchedule', () => {
    it('should be a function', () => {
      expect(typeof createIntervalsFromDailySchedule).toBe('function');
    });

    it('should return empty array for isClosed', () => {
      const closeDay = {
        isClosed: true,
      };

      const intervals = createIntervalsFromDailySchedule(closeDay);

      expect(Array.isArray(intervals)).toBe(true);
      expect(intervals.length).toBe(0);
    });

    it('should return an array with 1 interval for no breaks', () => {
      const startTime = time(8, 0);
      const endTime = time(5, 0);

      const day = {
        isClosed: false,
        startTime,
        endTime,
      };

      const intervals = createIntervalsFromDailySchedule(day);

      expect(Array.isArray(intervals)).toBe(true);
      expect(intervals.length).toBe(1);
      expect(intervals).toEqual([
        {
          openedStart: true,
          startTime,
          endTime,
          closedEnd: true,
        },
      ]);
    });

    it('should return an array of 2 intervals for 1 break', () => {
      const startTime = time(8, 0);
      const endTime = time(17, 0);
      const breakStartTime = time(12, 0);
      const breakEndTime = time(13, 0);

      const day = {
        isClosed: false,
        startTime,
        endTime,
        breaks: [
          { startTime: breakStartTime, endTime: breakEndTime },
        ],
      };

      const intervals = createIntervalsFromDailySchedule(day);

      expect(Array.isArray(intervals)).toBe(true);
      expect(intervals.length).toBe(2);
      expect(intervals).toEqual([
        {
          openedStart: true,
          startTime,
          endTime: breakStartTime,
          closedEnd: false,
        },
        {
          openedStart: false,
          startTime: breakEndTime,
          endTime,
          closedEnd: true,
        },
      ]);
    });

    it('should return an array of 2 intervals for multiple breaks', () => {
      const startTime = time(8, 0);
      const endTime = time(20, 0);

      const day = {
        isClosed: false,
        startTime,
        endTime,
        breaks: [
          { startTime: time(10, 0), endTime: time(11, 0) },
          { startTime: time(12, 0), endTime: time(13, 0) },
          { startTime: time(15, 0), endTime: time(16, 0) },
          { startTime: time(18, 0), endTime: time(18, 30) },
        ],
      };

      const intervals = createIntervalsFromDailySchedule(day);

      expect(Array.isArray(intervals)).toBe(true);
      expect(intervals.length).toBe(5);
      expect(intervals).toEqual([
        {
          openedStart: true,
          startTime,
          endTime: time(10, 0),
          closedEnd: false,
        },
        {
          openedStart: false,
          startTime: time(11, 0),
          endTime: time(12, 0),
          closedEnd: false,
        },
        {
          openedStart: false,
          startTime: time(13, 0),
          endTime: time(15, 0),
          closedEnd: false,
        },
        {
          openedStart: false,
          startTime: time(16, 0),
          endTime: time(18, 0),
          closedEnd: false,
        },
        {
          openedStart: false,
          startTime: time(18, 30),
          endTime,
          closedEnd: true,
        },
      ]);
    });
  });

  describe('#getProperDateWithZone', () => {
    it('should be a function', () => {
      expect(typeof getProperDateWithZone).toBe('function');
    });

    it('should return 2018-03-19 when New York', async () => {
      const date = getProperDateWithZone('2018-03-19T04:54:18.572Z', 'America/New_York');
      expect(date).toBe('2018-03-19');
    });

    it('should return 2018-03-18 when Vancouver', async () => {
      const date = getProperDateWithZone('2018-03-19T04:54:18.572Z', 'America/Vancouver');
      expect(date).toBe('2018-03-18');
    });

    it('should return 2018-03-19 when London', async () => {
      const date = getProperDateWithZone('2018-03-19T04:54:18.572Z', 'Europe/London');
      expect(date).toBe('2018-03-19');
    });
  });

  describe('#getDailySchedules', () => {
    it('should be a function', () => {
      expect(typeof getDailySchedules).toBe('function');
    });

    it('should return an array of 1 dailySchedule if startDate and endDate are same-day', () => {
      const weeklySchedule = createWeeklySchedule();
      const mondayStartDate = new Date(2017, 2, 20, 8, 0);
      const mondayEndDate = new Date(2017, 2, 20, 17, 0);

      const dailySchedules = getDailySchedules(weeklySchedule, mondayStartDate, mondayEndDate);

      expect(Array.isArray(dailySchedules)).toBe(true);
      expect(dailySchedules.length).toBe(1);
      expect(dailySchedules).toEqual([
        weeklySchedule.monday,
      ]);
    });

    it('should return an array of 2 dailySchedules for difference in days = 1', () => {
      const weeklySchedule = createWeeklySchedule();
      const mondayStartDate = new Date(2017, 2, 20, 8, 0);
      const tuesdayEndDate = new Date(2017, 2, 21, 17, 0);

      const dailySchedules = getDailySchedules(weeklySchedule, mondayStartDate, tuesdayEndDate);

      expect(Array.isArray(dailySchedules)).toBe(true);
      expect(dailySchedules.length).toBe(2);
      expect(dailySchedules).toEqual([
        weeklySchedule.monday,
        weeklySchedule.tuesday,
      ]);
    });

    it('should return an array of 2 dailySchedules for difference in days = 0 but separate days', () => {
      const weeklySchedule = createWeeklySchedule();
      const mondayStartDate = new Date(2017, 2, 20, 8, 0);

      // notice how it is not more than 24 hours away but a different day
      const tuesdayEndDate = new Date(2017, 2, 21, 7, 0);

      const dailySchedules = getDailySchedules(weeklySchedule, mondayStartDate, tuesdayEndDate);

      expect(Array.isArray(dailySchedules)).toBe(true);
      expect(dailySchedules.length).toBe(2);
      expect(dailySchedules).toEqual([
        weeklySchedule.monday,
        weeklySchedule.tuesday,
      ]);
    });

    it('should return an array of 5 dailySchedules', () => {
      const weeklySchedule = createWeeklySchedule();
      const mondayStartDate = new Date(2017, 2, 20, 8, 0);
      const fridayEndDate = new Date(2017, 2, 24, 17, 0);

      const dailySchedules = getDailySchedules(weeklySchedule, mondayStartDate, fridayEndDate);

      expect(Array.isArray(dailySchedules)).toBe(true);
      expect(dailySchedules.length).toBe(5);
      expect(dailySchedules).toEqual([
        weeklySchedule.monday,
        weeklySchedule.tuesday,
        weeklySchedule.wednesday,
        weeklySchedule.thursday,
        weeklySchedule.friday,
      ]);
    });
  });

  describe('#combineDateAndTime', () => {
    it('should be a function', () => {
      expect(typeof combineDateAndTime).toBe('function');
    });

    it('should return the correct time on the right day', () => {
      const startTime = time(4, 56);
      const day = (new Date(2017, 4, 1));
      const combinedDate = combineDateAndTime(day, startTime);
      expect(typeof combinedDate).toBe('string');
      expect(combinedDate).toBe((new Date(2017, 4, 1, 4, 56)).toISOString());
    });
  });

  describe('#createIntervalsFromWeeklySchedule', () => {
    it('should be a function', () => {
      expect(typeof createIntervalsFromWeeklySchedule).toBe('function');
    });

    // TODO: write Unit Tests for this!!!!!!!
    it('should return the schedule for monday', () => {
      // Need to describe with offset dates
      const sd = new Date(2017, 4, 1, 7, 32);
      const ed = new Date(2017, 4, 1, 19, 56);
      const weeklySchedule = createWeeklySchedule({
        monday: {
          startTime: time(12, 0),
          endTime: time(16, 0),
        },
      });

      const intervals = createIntervalsFromWeeklySchedule(weeklySchedule, sd, ed);
      expect(Array.isArray(intervals)).toBe(true);
      expect(intervals.length).toBe(1);

      const { startDate, endDate } = intervals[0];
      expect(startDate).toBe(new Date(2017, 4, 1, 12, 0).toISOString());
      expect(endDate).toBe(new Date(2017, 4, 1, 16, 0).toISOString());
    });

    // TODO: write Unit Tests for this!!!!!!!
    it('should return the intervals for monday to friday', () => {
      // Need to describe with offset dates
      const sd = new Date(2017, 4, 1, 7, 32);
      const ed = new Date(2017, 4, 6, 7, 32);
      const weeklySchedule = createWeeklySchedule();

      const intervals = createIntervalsFromWeeklySchedule(weeklySchedule, sd, ed);
      expect(Array.isArray(intervals)).toBe(true);
      expect(intervals.length).toBe(5);

      expect(intervals[0].startDate).toBe(new Date(2017, 4, 1, 8, 0).toISOString());
      expect(intervals[0].endDate).toBe(new Date(2017, 4, 1, 17, 0).toISOString());
      expect(intervals[1].startDate).toBe(new Date(2017, 4, 2, 8, 0).toISOString());
      expect(intervals[1].endDate).toBe(new Date(2017, 4, 2, 17, 0).toISOString());
      expect(intervals[2].startDate).toBe(new Date(2017, 4, 3, 8, 0).toISOString());
      expect(intervals[2].endDate).toBe(new Date(2017, 4, 3, 17, 0).toISOString());
      expect(intervals[3].startDate).toBe(new Date(2017, 4, 4, 8, 0).toISOString());
      expect(intervals[3].endDate).toBe(new Date(2017, 4, 4, 17, 0).toISOString());
      expect(intervals[4].startDate).toBe(new Date(2017, 4, 5, 8, 0).toISOString());
      expect(intervals[4].endDate).toBe(new Date(2017, 4, 5, 17, 0).toISOString());
    });

  });

  describe('#breakdownTimeSlot', () => {
    it('should be a function', () => {
      expect(typeof breakdownTimeSlot).toBe('function');
    });

    it('should return 0 timeSlots', () => {
      const intervalLength = 61;
      const minimumLength = 30;
      const startDate = new Date(2017, 2, 30, 9, 0);
      const endDate = new Date(2017, 2, 30, 10, 0);
      const timeSlot = {
        startDate,
        endDate,
      };

      const timeSlots = breakdownTimeSlot(timeSlot, intervalLength, minimumLength);
      expect(Array.isArray(timeSlots)).toBe(true);
      expect(timeSlots.length).toBe(0);
    });

    it('should return 1 timeSlot from startDate to endDate - no remainder', () => {
      const intervalLength = 60;
      const minimumLength = 30;
      const startDate = new Date(2017, 2, 30, 9, 0);
      const endDate = new Date(2017, 2, 30, 10, 0);
      const timeSlot = {
        startDate,
        endDate,
      };

      const timeSlots = breakdownTimeSlot(timeSlot, intervalLength, minimumLength);
      expect(Array.isArray(timeSlots)).toBe(true);
      expect(timeSlots.length).toBe(1);
      expect(timeSlots[0]).toEqual({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    });

    test.skip('should return 1 timeSlot from startDate to endDate - timeSlot has remainder', () => {
      const intervalLength = 60;
      const minimumLength = 30;
      const startDate = new Date(2017, 2, 30, 9, 0);
      const endDate = new Date(2017, 2, 30, 10, 30);
      const timeSlot = {
        startDate,
        endDate,
      };

      const timeSlots = breakdownTimeSlot(timeSlot, intervalLength, minimumLength);
      expect(Array.isArray(timeSlots)).toBe(true);
      expect(timeSlots.length).toBe(1);
      expect(timeSlots[0]).toEqual({
        startDate: startDate.toISOString(),
        endDate: (new Date(2017, 2, 30, 10, 0)).toISOString(),
      });
    });

    test.skip('should return 1 timeSlot from startDate to endDate - timeSlot has remainder', () => {
      const intervalLength = 60;
      const minimumLength = 30;
      const startDate = new Date(2017, 2, 30, 9, 0);
      const endDate = new Date(2017, 2, 30, 11, 30);
      const timeSlot = {
        startDate,
        endDate,
      };

      const timeSlots = breakdownTimeSlot(timeSlot, intervalLength, minimumLength);
      expect(Array.isArray(timeSlots)).toBe(true);
      expect(timeSlots.length).toBe(2);
      expect(timeSlots[0]).toEqual({
        startDate: startDate.toISOString(),
        endDate: (new Date(2017, 2, 30, 10, 0)).toISOString(),
      });

      expect(timeSlots[1]).toEqual({
        startDate: (new Date(2017, 2, 30, 10, 0)).toISOString(),
        endDate: (new Date(2017, 2, 30, 11, 0)).toISOString(),
      });
    });
  });

  describe('#createPossibleTimeSlots', () => {
    it('should be a function', () => {
      expect(typeof createPossibleTimeSlots).toBe('function');
    });

    test.skip('should return 4 time slots', () => {
      const intervalLength = 60;
      const minimumLength = 30;
      const timeSlots = [
        {
          startDate: new Date(2017, 2, 30, 9, 0),
          endDate: new Date(2017, 2, 30, 11, 30),
        },
        {
          startDate: new Date(2017, 2, 30, 14, 30),
          endDate: new Date(2017, 2, 30, 16, 30),
        },
      ];

      const newTimeSlots = createPossibleTimeSlots(timeSlots, intervalLength, minimumLength);
      expect(Array.isArray(newTimeSlots)).toBe(true);
      expect(newTimeSlots.length).toBe(4);
      expect(newTimeSlots[0]).toEqual({
        startDate: (new Date(2017, 2, 30, 9, 0)).toISOString(),
        endDate: (new Date(2017, 2, 30, 10, 0)).toISOString(),
      });

      expect(newTimeSlots[3]).toEqual({
        startDate: (new Date(2017, 2, 30, 15, 30)).toISOString(),
        endDate: (new Date(2017, 2, 30, 16, 30)).toISOString(),
      });
    });
  });

  describe('#isDuringEachother', () => {
    it('should be a function', () => {
      expect(typeof isDuringEachother).toBe('function');
    });

    it('should return false for completely outside', () => {
      const a = {
        startDate: new Date(2017, 1, 1, 8, 0),
        endDate: new Date(2017, 1, 1, 9, 0),
      };

      const b = {
        startDate: new Date(2017, 2, 1, 8, 0),
        endDate: new Date(2017, 2, 1, 9, 0),
      };

      expect(isDuringEachother(a, b)).toBe(false);
    });

    it('should return false for just before', () => {
      const a = {
        startDate: new Date(2017, 1, 1, 8, 0),
        endDate: new Date(2017, 1, 1, 9, 0),
      };

      const b = {
        startDate: new Date(2017, 1, 1, 7, 0),
        endDate: new Date(2017, 1, 1, 8, 0),
      };

      expect(isDuringEachother(a, b)).toBe(false);
    });

    it('should return false for just after', () => {
      const a = {
        startDate: new Date(2017, 1, 1, 8, 0),
        endDate: new Date(2017, 1, 1, 9, 0),
      };

      const b = {
        startDate: new Date(2017, 1, 1, 9, 0),
        endDate: new Date(2017, 1, 1, 10, 0),
      };

      expect(isDuringEachother(a, b)).toBe(false);
    });

    it('should return true for equal', () => {
      const a = {
        startDate: new Date(2017, 1, 1, 8, 0),
        endDate: new Date(2017, 1, 1, 9, 0),
      };

      const b = {
        startDate: new Date(2017, 1, 1, 8, 0),
        endDate: new Date(2017, 1, 1, 9, 0),
      };

      expect(isDuringEachother(a, b)).toBe(true);
    });

    it('should return true for during before', () => {
      const a = {
        startDate: new Date(2017, 1, 1, 8, 0),
        endDate: new Date(2017, 1, 1, 9, 0),
      };

      const b = {
        startDate: new Date(2017, 1, 1, 7, 30),
        endDate: new Date(2017, 1, 1, 8, 30),
      };

      expect(isDuringEachother(a, b)).toBe(true);
    });

    it('should return true for during after', () => {
      const a = {
        startDate: new Date(2017, 1, 1, 8, 0),
        endDate: new Date(2017, 1, 1, 9, 0),
      };

      const b = {
        startDate: new Date(2017, 1, 1, 8, 30),
        endDate: new Date(2017, 1, 1, 9, 30),
      };

      expect(isDuringEachother(a, b)).toBe(true);
    });
  });

  describe('#getHoursFromInterval', () => {
    test('should return 4 hours', () => {
      const interval = {
        startDate: new Date(2017, 1, 1, 8, 0),
        endDate: new Date(2017, 1, 1, 12, 0),
      };

      expect(getHoursFromInterval(interval)).toBe(4);
    });

    test('should return 28 hours', () => {
      const interval = {
        startDate: new Date(2017, 1, 1, 8, 30),
        endDate: new Date(2017, 1, 2, 12, 30),
      };

      expect(getHoursFromInterval(interval)).toBe(28);
    });

    test('should return 1.5 hours', () => {
      const interval = {
        startDate: new Date(2017, 1, 1, 8, 30),
        endDate: new Date(2017, 1, 1, 10, 0),
      };

      expect(getHoursFromInterval(interval)).toBe(1.5);
    });

    test('should return 1.25 hours', () => {
      const interval = {
        startDate: new Date(2017, 1, 1, 8, 45),
        endDate: new Date(2017, 1, 1, 10, 0),
      };

      expect(getHoursFromInterval(interval)).toBe(1.25);
    });
  });

  describe('#getAvailableHoursFromInterval', () => {
    test.skip('should return 40 hours for M-F 8-12,1-5', () => {
      const weeklySchedule = createWeeklyScheduleWithBreaks();
      const startDate = new Date(2017, 7, 7, 6, 0);
      const endDate = new Date(2017, 7, 11, 22, 0);
      expect(getAvailableHours(
        weeklySchedule,
        startDate,
        endDate,
      )).toBe(40);
    });
  });

  describe('#convertIntervalStringToObject', () => {
    test('should be a function', () => {
      expect(typeof convertIntervalStringToObject).toBe('function');
    });

    test('should match object with 1 week', () => {
      expect(convertIntervalStringToObject('1 weeks')).toEqual({
        years: 0,
        months: 0,
        weeks: 1,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
    });

    test('should match object with -1 week and 3 days', () => {
      expect(convertIntervalStringToObject('-1 weeks 3 days')).toEqual({
        years: 0,
        months: 0,
        weeks: -1,
        days: 3,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
    });

    test('should match object with -1.1 week and 3.53 days', () => {
      expect(convertIntervalStringToObject('-1.1 weeks 3.53 days')).toEqual({
        years: 0,
        months: 0,
        weeks: -1.1,
        days: 3.53,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
    });
  });

  describe('#sortIntervalPredicate', () => {
    test('should be a function', () => {
      expect(typeof sortIntervalDescPredicate).toBe('function');
    });

    test('should sort the intervals properly', () => {
      expect([
        '1 weeks',
        '1 years',
        '-5 years 11 months',
        '-4 years',
        '12 seconds',
        '1 days',
      ].sort(sortIntervalDescPredicate)).toEqual([
        '1 years',
        '1 weeks',
        '1 days',
        '12 seconds',
        '-4 years',
        '-5 years 11 months',
      ]);
    });

    test('should sort the intervals properly', () => {
      expect([
        '-1 months',
        '-1 weeks',
        '1 months',
        '1 weeks',
      ].sort(sortIntervalDescPredicate)).toEqual([
        '1 months',
        '1 weeks',
        '-1 weeks',
        '-1 months',
      ]);
    });
  });

  describe('#floorDateMinutes', () => {
    test('should return 12:05 if it is 12:06', () => {
      const date = (new Date(2018, 8, 8, 12, 6)).toISOString();
      const floored = new Date(floorDateMinutes(date, 5));
      expect(floored.getHours()).toBe(12);
      expect(floored.getMinutes()).toBe(5);
    });

    test('should return 12:05 if it is 12:05', () => {
      const date = (new Date(2018, 8, 8, 12, 5)).toISOString();
      const floored = new Date(floorDateMinutes(date, 5));
      expect(floored.getHours()).toBe(12);
      expect(floored.getMinutes()).toBe(5);
    });
  });

  describe('#ceilDateMinutes', () => {
    test('should return 12:10 if it is 12:06', () => {
      const date = (new Date(2018, 8, 8, 12, 6)).toISOString();
      const ceiled = new Date(ceilDateMinutes(date, 5));
      expect(ceiled.getHours()).toBe(12);
      expect(ceiled.getMinutes()).toBe(10);
    });

    test('should return 12:10 if it is 12:10', () => {
      const date = (new Date(2018, 8, 8, 12, 10)).toISOString();
      const ceiled = new Date(ceilDateMinutes(date, 5));
      expect(ceiled.getHours()).toBe(12);
      expect(ceiled.getMinutes()).toBe(10);
    });
  });
});

