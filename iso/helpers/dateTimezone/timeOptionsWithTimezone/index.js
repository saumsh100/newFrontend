
import moment from 'moment-timezone';

/**
 * We store time and results in cache so we dont have to trigger this process all over again.
 */
let cachedTimezone = null;
let cachedResultsList = null;

/**
 * Creates a list of options for time selectors with values that includes timezone.
 * @param timezone
 * @return {Array}
 */
export default function (timezone = 'America/Vancouver') {
  if (typeof timezone !== 'string') {
    throw new Error('Timezone has to be string');
  }

  if (timezone === cachedTimezone && cachedResultsList) {
    return cachedResultsList;
  }

  const timeOptions = [];
  const totalHours = 24;
  const increment = 5;
  const increments = 60 / increment;

  let i;
  for (i = 0; i < totalHours; i += 1) {
    let j;
    for (j = 0; j < increments; j += 1) {
      const time = moment.tz(`1970-1-31 ${i}:${j * increment}`, 'YYYY-M-D H:mm', timezone);
      const value = time.format();
      const label = time.format('LT');
      timeOptions.push({
        value,
        label,
      });
    }
  }
  cachedTimezone = timezone;
  cachedResultsList = timeOptions;
  return timeOptions;
}

export {
  cachedResultsList,
  cachedTimezone,
};
