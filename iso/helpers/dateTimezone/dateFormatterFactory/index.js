import { setDateToTimezone } from '../../../../server/util/time';

/**
 * Curried function to format the passed dateTime also taking in consideration the timezone.
 *
 * @param {string} format
 * @param {string} timezone
 * @param {string} dateTime
 */
const dateFormatterFactory = format => (timezone = '') => dateTime =>
  setDateToTimezone(dateTime, timezone).format(format);

export default dateFormatterFactory;
