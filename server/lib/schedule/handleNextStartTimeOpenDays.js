
import { dateDiffInMinutes, addOffset, setDateToTimezone } from '@carecru/isomorphic';

const MAX_DEFAULT_OPEN_WINDOW = 15; // minutes

/**
 * Function that get working days
 * @param account
 * @param schedule
 * @returns {object}
 */
export default function getNextStartTime({
  bufferBeforeOpening,
  bufferAfterClosing,
}, schedule = {}) {
  const filteredSchedule = Object.values(schedule)
    .find(daySchedule =>
      !daySchedule.isClosed && // Practice is not closed
      daySchedule.startTime !== daySchedule.endTime && // start time is not equal to the end time
      // difference between start and end time is more then window allows
      dateDiffInMinutes(
        new Date(daySchedule.startTime),
        new Date(daySchedule.endTime),
      ) > MAX_DEFAULT_OPEN_WINDOW);

  if (!filteredSchedule) {
    throw new Error('Practice has no open office hours');
  }

  return normalizeResponse({
    ...filteredSchedule,
    startTime: addBuffer(filteredSchedule.startTime, bufferBeforeOpening),
    endTime: addBuffer(filteredSchedule.endTime, bufferAfterClosing),
  });
}

/**
 * Add buffer the to time value.
 * @param time
 * @param buffer
 * @return {number}
 */
function addBuffer(time, buffer) {
  return buffer ? addOffset(time, buffer).toISOString() : new Date(time).toISOString();
}

/**
 * Return the next opening day in the correct format.
 * @param openingDay
 * @return {{openAtTheMoment: boolean}}
 */
function normalizeResponse(openingDay) {
  const openingTime = new Date(openingDay.startTime).getTime();
  const closingTime = new Date(openingDay.endTime).getTime();
  const currentTime = Date.now();

  return {
    ...openingDay,
    openAtTheMoment: currentTime >= openingTime && currentTime <= closingTime,
  };
}

