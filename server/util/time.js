
import moment from 'moment';
import 'moment-timezone';
import isEmpty from 'lodash/isEmpty';

// OS of the computer will add timezone to this function
const Time = {
  time: (hours, minutes) => new Date(1970, 1, 0, hours, minutes),

  timeWithZone(hours, minutes, timezone) {
    const now = moment(new Date(Date.UTC(1970, 1, 0, hours, minutes)));
    const another = now.clone();
    another.tz(timezone);
    now.add(-1 * another.utcOffset(), 'minutes');
    return now._d;
  },

  getISOSortPredicate: property => (a, b) => {
    const ap = a[property];
    const bp = b[property];
    return (ap < bp) ? -1 : ((ap > bp) ? 1 : 0);
  },

  /**
   *
   * @param date
   * @param time
   * @returns {string}
   */
  combineDateAndTime(date, time) {
    const mTime = moment(time);
    return moment(date)
      .hours(mTime.hours())
      .minutes(mTime.minutes())
      .seconds(mTime.seconds())
      .milliseconds(mTime.seconds())
      .toISOString();
  },

  getHoursFromInterval({ startDate, endDate }) {
    return moment(endDate).diff(startDate, 'hours', true);
  },

  /**
   *
   * @param date
   * @param timeSlot
   * @returns {*}
   */
  combineDateAndTimeSlot(date, timeSlot) {
    // combine day from date and time from timeSlot into a new timeSlot
    return Object.assign({}, timeSlot, {
      startDate: Time.combineDateAndTime(date, timeSlot.startTime),
      endDate: Time.combineDateAndTime(date, timeSlot.endTime),
    });
  },

  isDuringEachother(a, b) {
    const aDateStart = new Date(a.startDate);
    const bDateStart = new Date(b.startDate);
    const aDateEnd = new Date(a.endDate);
    const bDateEnd = new Date(b.endDate);
    const startTimeDuring = aDateStart > bDateStart && aDateStart < bDateEnd;
    const startTimeEqual = aDateStart.getTime() === bDateStart.getTime();

    const endTimeDuring = aDateEnd > bDateStart && aDateEnd < bDateEnd;
    const endTimeEqual = aDateEnd.getTime() === bDateEnd.getTime();

    return startTimeDuring || startTimeEqual || endTimeDuring || endTimeEqual;
  },

  isDuringEachotherTimeOff(a, b) {
    const aDateStart = new Date(a.startDate);
    const bDateStart = new Date(b.startDate);
    const aDateEnd = new Date(a.endDate);
    const bDateEnd = new Date(b.endDate);

    const startTimeDuring = bDateStart > aDateStart && bDateStart < aDateEnd;
    const dayStartEqual = aDateStart.getTime() === bDateStart.getTime();
    const startTimeEqual = aDateStart.toDateString() === bDateStart.toDateString() && a.allDay;
    const endTimeDuring = bDateEnd > aDateStart && bDateEnd < aDateEnd;
    const dayEndEqual = aDateEnd.toDateString() === bDateEnd.toDateString() && a.allDay;
    const endTimeEqual = aDateEnd.getTime() === bDateEnd.getTime();

    return startTimeDuring || startTimeEqual || endTimeDuring || endTimeEqual || dayStartEqual || dayEndEqual;
  },

  /**
   *
   * @param timeSlots
   * @param intervalLength
   * @param minimumLength
   */
  createPossibleTimeSlots(timeSlots, intervalLength, minimumLength) {
    const len = timeSlots.length;
    const realInterval = Math.ceil(intervalLength / minimumLength);

    let i;
    let possibleTimeSlots = [];
    for (i = 0; i < len; i++) {
      possibleTimeSlots = [
        ...possibleTimeSlots,
        ...Time.breakdownTimeSlot(timeSlots[i], minimumLength * realInterval, minimumLength),
      ];
    }

    return possibleTimeSlots;
  },

  breakdownTimeSlot(timeSlot, intervalLength, minimumLength) {
    const {
      startDate,
      endDate,
    } = timeSlot;

    const timeSlots = [];
    const start = moment(startDate);
    const end = start.clone().add(intervalLength, 'minutes');
    while (moment(end).isSameOrBefore(endDate)) {
      timeSlots.push({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });

      start.add(minimumLength, 'minutes');
      end.add(minimumLength, 'minutes');
    }

    return timeSlots;
  },

  /**
   * createIntervalsFromDailySchedule will take in a single day's dailySchedule
   * and spit out the operational intervals (time ranges where the clinic/practitioner is open/working)
   *
   * @param dailySchedule
   * @returns {*}
   */
  createIntervalsFromDailySchedule(dailySchedule) {
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
   * - we breakdown these timeslots and then compare against actual appointments
   *
   * @param weeklySchedule
   * @param startDate ISOString
   * @param endDate ISOString
   */
  createIntervalsFromWeeklySchedule(weeklySchedule, startDate, endDate) {
    // Get the array of dailySchedules
    const dailySchedules = Time.getDailySchedules(weeklySchedule, startDate, endDate);

    // Loop over and fill out a flattened array of the broken down time intervals
    let i;
    let timeIntervals = [];
    for (i = 0; i < dailySchedules.length; i++) {
      // TODO: add conversion of
      const newTimeIntervals = Time.createIntervalsFromDailySchedule(dailySchedules[i]).map((day) => {
        const date = moment(startDate).add(i, 'days');
        return Time.combineDateAndTimeSlot(date, day);
      });

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
  getDailySchedules(weeklySchedule, startDate, endDate) {
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

    // Check if there's a pattern and which weekly schedule to use
    let weeklyScheduleStart = weeklySchedule;
    let weeklyScheduleEnd = weeklySchedule;

    if (weeklySchedule.isAdvanced) {
      const week = momentStart.diff(weeklySchedule.startDate, 'week') % (weeklySchedule.weeklySchedules.length + 1);
      if (week > 0) {
        weeklyScheduleStart = weeklySchedule.weeklySchedules[week - 1];
      }
      const weekEnd = momentStart.diff(weeklySchedule.startDate, 'week') % (weeklySchedule.weeklySchedules.length + 1);
      if (week > 0) {
        weeklyScheduleEnd = weeklySchedule.weeklySchedules[weekEnd - 1];
      }
    }

    // Pluck the dailySchedules based on day
    const startDailySchedule = weeklyScheduleStart[startDayOfWeek];
    const endDailySchedule = weeklyScheduleEnd[endDayOfWeek];

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

      let weeklyScheduleAdvance = weeklySchedule;

      // Check if there's a pattern and which weekly schedule to use
      if (weeklySchedule.isAdvanced) {
        const week = momentStart.diff(weeklySchedule.startDate, 'week') % (weeklySchedule.weeklySchedules.length + 1);
        if (week > 0) {
          weeklyScheduleAdvance = weeklySchedule.weeklySchedules[week - 1];
        }
      }

      const nextDayOfWeek = momentStart.format('dddd').toLowerCase();
      dailySchedules.push(weeklyScheduleAdvance[nextDayOfWeek]);
    }

    return dailySchedules;
  },

  getAvailableHours(weeklySchedule, startDate, endDate) {
    const intervals = Time.createIntervalsFromWeeklySchedule(weeklySchedule, startDate, endDate);
    const filteredIntervals = intervals.filter(i => Time.isDuringEachother(i, { startDate, endDate }));
    // console.log(intervals.length);
    // console.log(filteredIntervals.length);
    return intervals.reduce((availableHours, interval) => {
      // console.log(interval);
      // console.log(Time.getHoursFromInterval(interval));
      return availableHours + Time.getHoursFromInterval(interval);
    }, 0);
  },
};

module.exports = Time;
