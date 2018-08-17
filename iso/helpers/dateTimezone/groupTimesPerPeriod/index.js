import isEqual from 'lodash/isEqual';
import { setDateToTimezone } from '../../../../server/util/time';

const SPLIT_AFTERNOON = 12;
const SPLIT_EVENING = 17;

/**
 * Reducer that groups times in periods,
 * it's a requirment that the default value,
 * is the same as showed below.
 * It will group times using the split times listed above.
 *
 * @param {object} previous
 * @param {object} current
 * @param {number} index
 */

const groupTimesPerPeriod = timezone =>  (previous, current, index) => {
  if (
    index === 0 &&
    !isEqual(previous, {
      morning: [],
      afternoon: [],
      evening: [],
      total: 0,
    })
  ) {
    throw new Error('The default value of your reduce is not valid, you must use the structure showed above.');
  }
  const selectedHour = parseFloat(setDateToTimezone(current.startDate, timezone).format('HH'));
  if (selectedHour >= SPLIT_AFTERNOON && selectedHour <= SPLIT_EVENING) {
    previous = {
      ...previous,
      afternoon: [...previous.afternoon, current],
    };
  } else if (selectedHour >= SPLIT_EVENING) {
    previous = {
      ...previous,
      evening: [...previous.evening, current],
    };
  } else {
    previous = {
      ...previous,
      morning: [...previous.morning, current],
    };
  }

  return { ...previous, total: previous.total + 1 };
};

export default groupTimesPerPeriod;
