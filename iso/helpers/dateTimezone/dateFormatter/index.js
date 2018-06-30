import { setDateToTimezone } from '../../../../server/util/time';

/**
 * With the passed dateTime, format it taking in consideration the timezone as well.
 *
 * @param {string} dateTime
 * @param {string} timezone
 * @param {string} format
 */
const dateFormatter = (dateTime, timezone = '', format) =>
  setDateToTimezone(dateTime, timezone).format(format);

export default dateFormatter;
