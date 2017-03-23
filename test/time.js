/**
 * Created by sharp on 2017-03-22.
 */

const { expect } = require('chai');
const {
  time,
  createIntervalsFromDailySchedule,
  getDailySchedules,
  createIntervalsFromWeeklySchedule,
} = require('../server/util/time');


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

describe('util/time', () => {
  describe('#time', () => {
    it('should be a function', () => {
      expect(time).to.be.a('function');
    });
  });

  describe('#createIntervalsFromDailySchedule', () => {
    it('should be a function', () => {
      expect(createIntervalsFromDailySchedule).to.be.a('function');
    });

    it('should return empty array for isClosed', () => {
      const closeDay = {
        isClosed: true,
      };

      const intervals = createIntervalsFromDailySchedule(closeDay);

      expect(intervals).to.be.an('array');
      expect(intervals.length).to.equal(0);
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

      expect(intervals).to.be.an('array');
      expect(intervals.length).to.equal(1);
      expect(intervals).to.deep.equal([
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

      expect(intervals).to.be.an('array');
      expect(intervals.length).to.equal(2);
      expect(intervals).to.deep.equal([
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

      expect(intervals).to.be.an('array');
      expect(intervals.length).to.equal(5);
      expect(intervals).to.deep.equal([
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

  describe('#getDailySchedules', () => {
    it('should be a function', () => {
      expect(getDailySchedules).to.be.a('function');
    });

    it('should return an array of 1 dailySchedule if startDate and endDate are same-day', () => {
      const weeklySchedule = createWeeklySchedule();
      const mondayStartDate = new Date(2017, 2, 20, 8, 0);
      const mondayEndDate = new Date(2017, 2, 20, 17, 0);

      const dailySchedules = getDailySchedules(weeklySchedule, mondayStartDate, mondayEndDate);

      expect(dailySchedules).to.be.an('array');
      expect(dailySchedules.length).to.equal(1);
      expect(dailySchedules).to.deep.equal([
        weeklySchedule.monday,
      ]);
    });

    it('should return an array of 2 dailySchedules for difference in days = 1', () => {
      const weeklySchedule = createWeeklySchedule();
      const mondayStartDate = new Date(2017, 2, 20, 8, 0);
      const tuesdayEndDate = new Date(2017, 2, 21, 17, 0);

      const dailySchedules = getDailySchedules(weeklySchedule, mondayStartDate, tuesdayEndDate);

      expect(dailySchedules).to.be.an('array');
      expect(dailySchedules.length).to.equal(2);
      expect(dailySchedules).to.deep.equal([
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

      expect(dailySchedules).to.be.an('array');
      expect(dailySchedules.length).to.equal(2);
      expect(dailySchedules).to.deep.equal([
        weeklySchedule.monday,
        weeklySchedule.tuesday,
      ]);
    });

    it('should return an array of 5 dailySchedules', () => {
      const weeklySchedule = createWeeklySchedule();
      const mondayStartDate = new Date(2017, 2, 20, 8, 0);
      const fridayEndDate = new Date(2017, 2, 24, 17, 0);

      const dailySchedules = getDailySchedules(weeklySchedule, mondayStartDate, fridayEndDate);

      expect(dailySchedules).to.be.an('array');
      expect(dailySchedules.length).to.equal(5);
      expect(dailySchedules).to.deep.equal([
        weeklySchedule.monday,
        weeklySchedule.tuesday,
        weeklySchedule.wednesday,
        weeklySchedule.thursday,
        weeklySchedule.friday,
      ]);
    });
  });

  describe('#createIntervalsFromWeeklySchedule', () => {
    it('should be a function', () => {
      expect(createIntervalsFromWeeklySchedule).to.be.a('function');
    });


  });
});

