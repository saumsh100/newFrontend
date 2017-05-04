/**
 * Created by sharp on 2017-03-22.
 */

const { expect } = require('chai');
const {
  time,
  breakdownTimeSlot,
  createPossibleTimeSlots,
  createIntervalsFromDailySchedule,
  getDailySchedules,
  combineDateAndTime,
  createIntervalsFromWeeklySchedule,
  isDuringEachother,
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

  describe('#combineDateAndTime', () => {
    it('should be a function', () => {
      expect(combineDateAndTime).to.be.a('function');
    });

    it('should return the correct time on the right day', () => {
      const startTime = time(4, 56);
      const day = (new Date(2017, 4, 1));
      const combinedDate = combineDateAndTime(day, startTime);
      expect(combinedDate).to.be.a('string');
      expect(combinedDate).to.equal((new Date(2017, 4, 1, 4, 56)).toISOString());
    });
  });

  describe('#createIntervalsFromWeeklySchedule', () => {
    it('should be a function', () => {
      expect(createIntervalsFromWeeklySchedule).to.be.a('function');
    });

    // TODO: write Unit Tests for this!!!!!!!
    it('should return the schedule for monday', () => {
      // Need to test with offset dates
      const sd = new Date(2017, 4, 1, 7, 32);
      const ed = new Date(2017, 4, 1, 19, 56);
      const weeklySchedule = createWeeklySchedule({
        monday: {
          startTime: time(12, 0),
          endTime: time(16, 0),
        },
      });

      const intervals = createIntervalsFromWeeklySchedule(weeklySchedule, sd, ed);
      expect(intervals).to.be.an('array');
      expect(intervals.length).to.equal(1);

      const { startDate, endDate } = intervals[0];
      expect(startDate).to.equal(new Date(2017, 4, 1, 12, 0).toISOString());
      expect(endDate).to.equal(new Date(2017, 4, 1, 16, 0).toISOString());
    });

    // TODO: write Unit Tests for this!!!!!!!
    it('should return the intervals for monday to friday', () => {
      // Need to test with offset dates
      const sd = new Date(2017, 4, 1, 7, 32);
      const ed = new Date(2017, 4, 6, 7, 32);
      const weeklySchedule = createWeeklySchedule();

      const intervals = createIntervalsFromWeeklySchedule(weeklySchedule, sd, ed);
      expect(intervals).to.be.an('array');
      expect(intervals.length).to.equal(5);

      expect(intervals[0].startDate).to.equal(new Date(2017, 4, 1, 8, 0).toISOString());
      expect(intervals[0].endDate).to.equal(new Date(2017, 4, 1, 17, 0).toISOString());
      expect(intervals[1].startDate).to.equal(new Date(2017, 4, 2, 8, 0).toISOString());
      expect(intervals[1].endDate).to.equal(new Date(2017, 4, 2, 17, 0).toISOString());
      expect(intervals[2].startDate).to.equal(new Date(2017, 4, 3, 8, 0).toISOString());
      expect(intervals[2].endDate).to.equal(new Date(2017, 4, 3, 17, 0).toISOString());
      expect(intervals[3].startDate).to.equal(new Date(2017, 4, 4, 8, 0).toISOString());
      expect(intervals[3].endDate).to.equal(new Date(2017, 4, 4, 17, 0).toISOString());
      expect(intervals[4].startDate).to.equal(new Date(2017, 4, 5, 8, 0).toISOString());
      expect(intervals[4].endDate).to.equal(new Date(2017, 4, 5, 17, 0).toISOString());
    });

  });

  describe('#breakdownTimeSlot', () => {
    it('should be a function', () => {
      expect(breakdownTimeSlot).to.be.a('function');
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
      expect(timeSlots).to.be.an('array');
      expect(timeSlots.length).to.equal(0);
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
      expect(timeSlots).to.be.an('array');
      expect(timeSlots.length).to.equal(1);
      expect(timeSlots[0]).to.deep.equal({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    });

    it('should return 1 timeSlot from startDate to endDate - timeSlot has remainder', () => {
      const intervalLength = 60;
      const minimumLength = 30;
      const startDate = new Date(2017, 2, 30, 9, 0);
      const endDate = new Date(2017, 2, 30, 10, 30);
      const timeSlot = {
        startDate,
        endDate,
      };

      const timeSlots = breakdownTimeSlot(timeSlot, intervalLength, minimumLength);
      expect(timeSlots).to.be.an('array');
      expect(timeSlots.length).to.equal(1);
      expect(timeSlots[0]).to.deep.equal({
        startDate: startDate.toISOString(),
        endDate: (new Date(2017, 2, 30, 10, 0)).toISOString(),
      });
    });

    it('should return 1 timeSlot from startDate to endDate - timeSlot has remainder', () => {
      const intervalLength = 60;
      const minimumLength = 30;
      const startDate = new Date(2017, 2, 30, 9, 0);
      const endDate = new Date(2017, 2, 30, 11, 30);
      const timeSlot = {
        startDate,
        endDate,
      };

      const timeSlots = breakdownTimeSlot(timeSlot, intervalLength, minimumLength);
      expect(timeSlots).to.be.an('array');
      expect(timeSlots.length).to.equal(2);
      expect(timeSlots[0]).to.deep.equal({
        startDate: startDate.toISOString(),
        endDate: (new Date(2017, 2, 30, 10, 0)).toISOString(),
      });

      expect(timeSlots[1]).to.deep.equal({
        startDate: (new Date(2017, 2, 30, 10, 0)).toISOString(),
        endDate: (new Date(2017, 2, 30, 11, 0)).toISOString(),
      });
    });
  });

  describe('#createPossibleTimeSlots', () => {
    it('should be a function', () => {
      expect(createPossibleTimeSlots).to.be.a('function');
    });

    it('should return 4 time slots', () => {
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
      expect(newTimeSlots).to.be.an('array');
      expect(newTimeSlots.length).to.equal(4);
      expect(newTimeSlots[0]).to.deep.equal({
        startDate: (new Date(2017, 2, 30, 9, 0)).toISOString(),
        endDate: (new Date(2017, 2, 30, 10, 0)).toISOString(),
      });

      expect(newTimeSlots[3]).to.deep.equal({
        startDate: (new Date(2017, 2, 30, 15, 30)).toISOString(),
        endDate: (new Date(2017, 2, 30, 16, 30)).toISOString(),
      });
    });
  });

  describe('#isDuringEachother', () => {
    it('should be a function', () => {
      expect(isDuringEachother).to.be.a('function');
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

      expect(isDuringEachother(a, b)).to.equal(false);
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

      expect(isDuringEachother(a, b)).to.equal(false);
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

      expect(isDuringEachother(a, b)).to.equal(false);
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

      expect(isDuringEachother(a, b)).to.equal(true);
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

      expect(isDuringEachother(a, b)).to.equal(true);
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

      expect(isDuringEachother(a, b)).to.equal(true);
    });
  });
});

