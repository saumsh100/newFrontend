import dateFormatterFactory from '../dateFormatterFactory';

/**
 * With the passed dateTime, format it taking in consideration the timezone as well.
 *
 * @param {string} dateTime
 * @param {string} timezone
 * @param {string} format
 */
const dateFormatter = (dateTime, timezone = '', format) =>
  dateFormatterFactory(format)(timezone)(dateTime);

export default dateFormatter;
