
import { time } from '@carecru/isomorphic';

/**
 * Normalize a whole request object to have a correct date.
 * @param requestObject
 * @return {*}
 */
const normalizeRequest = (requestObject) => {
  if (typeof requestObject === 'string') {
    return normalizeTime(requestObject);
  }
  if (Array.isArray(requestObject)) {
    return requestObject.map(normalizeTime);
  }

  const normalizedObjects = Object.entries(requestObject)
    .map(([key, value]) => ({ [key]: normalizeRequest(value) }));

  return Object.assign(...normalizedObjects);
};

/**
 * Create a complete date-time from the requested time value.
 * @param requestTime
 * @return {string}
 */
const normalizeTime = (requestTime) => {
  const [hours, minutes] = requestTime.split(':');
  return time(hours, minutes).toISOString();
};


export default normalizeRequest;
