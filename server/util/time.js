
const moment = require('moment');
const isEmpty = require('lodash/isEmpty');

// OS of the computer will add timezone to this function
const Time = {
  time: (hours, minutes) => {
    return new Date(1970, 1, 0, hours, minutes);
  },

  /**
   * createIntervalsFromDailySchedule will take in a single day's dailySchedule
   * and spit out the operational intervals (time ranges where the clinic/practitioner is open/working)
   *
   * @param dailySchedule
   * @returns {*}
   */
  createIntervalsFromDailySchedule: (dailySchedule) => {
    const {
      isClosed,
      startTime,
      endTime,
      breaks,
    } = dailySchedule;

    if (isClosed) return [];

    if (isEmpty(breaks)) {
      const interval = {
        openedStart: true,
        startTime,
        endTime,
        closedEnd: true,
      };

      return [interval];
    }

    if (moment(endTime).isBefore(moment(breaks[breaks.length - 1].endTime))) {
      throw new Error('Time interval calculation assumes that breaks are in the correct order and before endTime');
    }

    // If breaks exists we will loop through and create intervals
    const intervals = [];
    const len = breaks.length;
    let i;
    for (i = 0; i <= len; i++) {
      if (i === 0) {
        // Set startTime to opening time
        intervals.push({
          openedStart: true,
          startTime,
          endTime: breaks[i].startTime,
          closedEnd: false,
        });

        continue;
      }

      if (i === len) {
        // set endTime to closed time
        intervals.push({
          openedStart: false,
          startTime: breaks[i - 1].endTime,
          endTime,
          closedEnd: true,
        });

        break;
      }

      intervals.push({
        openedStart: false,
        startTime: breaks[i - 1].endTime,
        endTime: breaks[i].startTime,
        closedEnd: false,
      });
    }

    return intervals;
  },

  /**
   *
   * createIntervalsFromWeeklySchedule will return an array of time intervals for general
   * availability
   *
   * - this is used in availabilities calc
   * - we compare these timeslots against actual appointments
   *
   * @param weeklySchedule
   * @param startDate ISOString
   * @param endDate ISOString
   */
  createIntervalsFromWeeklySchedule: (weeklySchedule, startDate, endDate) => {
    // Get the array of dailySchedules
    const dailySchedules = Time.getDailySchedules(weeklySchedule, startDate, endDate);

    // Loop over and fill out a flattened array of the broken down time intervals
    let i;
    let timeIntervals = [];
    for (i = 0; i < dailySchedules.length; i++) {
      const newTimeIntervals = Time.createIntervalsFromDailySchedule(dailySchedules[i]);
      timeIntervals = [...timeIntervals, ...newTimeIntervals];
    }

    return timeIntervals;
  },

  /**
   * getDailySchedules will return an array of the dailySchedules in order
   * from startDate to endDate
   *
   * @param weeklySchedule
   * @param startDate
   * @param endDate
   */
  getDailySchedules: (weeklySchedule, startDate, endDate) => {
    const momentStart = moment(startDate);
    const momentEnd = moment(endDate);
    if (momentStart.isAfter(momentEnd)) {
      throw new Error('startDate must be before endDate in createTimeIntervals');
    }

    // Get the number of day in the year '81', '96', etc.
    const startDay = momentStart.format('DDD');
    const endDay = momentEnd.format('DDD');

    // Get the day of the week, 'saturday', 'sunday', etc.
    const startDayOfWeek = momentStart.format('dddd').toLowerCase();
    const endDayOfWeek = momentEnd.format('dddd').toLowerCase();

    // Pluck the dailySchedules based on day
    const startDailySchedule = weeklySchedule[startDayOfWeek];
    const endDailySchedule = weeklySchedule[endDayOfWeek]

    const dailySchedules = [startDailySchedule];
    if (startDay === endDay) {
      // Check if day is in daysOff and return that special schedule
      return dailySchedules;
    }

    // Get number of days from start till end
    const numDays = momentEnd.diff(momentStart, 'days');
    if (numDays === 0) {
      // not 24 hours away but different days...
      dailySchedules.push(endDailySchedule);
      return dailySchedules;
    }

    // By now we should have two distinctly different times at least 1 day apart
    let i;
    for (i = 1; i <= numDays; i++) {
      if (i === numDays) {
        dailySchedules.push(endDailySchedule);
        break;
      }

      // Add 1 more day to the start time
      momentStart.add(1, 'days');
      const nextDayOfWeek = momentStart.format('dddd').toLowerCase();
      dailySchedules.push(weeklySchedule[nextDayOfWeek]);
    }

    return dailySchedules;
  },
};

module.exports = Time;
