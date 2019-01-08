
/**
 * Return the difference between two dateTime in minutes
 * @param startTime {Date}
 * @param endTime {Date}
 * @returns {number} difference in minutes
 */
const dateDiffInMinutes = (startTime, endTime) => {
  if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
    throw new Error('startTime or endTime is not a Date');
  }
  return Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60);
};

export default dateDiffInMinutes;

