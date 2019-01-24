
import { setDateToTimezone } from '../../../../server/util/time';

/**
 * Function used to set correct TZ and date-time
 * @param time {date}
 * @param set {date}
 * @returns {date}
 */
export default function setDateAndTZ(time, set, tz) {
  return setDateToTimezone(time, tz).set(set);
}
