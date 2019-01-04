
import firstName from './firstName';
import lastName from './lastName';
import age from './age';
import gender from './gender';
import city from './city';
import email from './email';
import status from './status';
import firstAppointment from './firstAppointment';
import lastAppointment from './lastAppointment';
import nextAppointment from './nextAppointment';
import production from './production';
import bookedAppointments from './bookedAppointments';
import onlineAppointments from './onlineAppointments';
import practitioner from './practitioner';
import lastReminder from './lastReminder';
import lastRecall from './lastRecall';
import reviews from './reviews';

const query = {
  firstName,
  lastName,
  age,
  gender,
  city,
  email,
  status,
  firstAppointment,
  lastAppointment,
  nextAppointment,
  production,
  bookedAppointments,
  onlineAppointments,
  practitioner,
  lastReminder,
  lastRecall,
  reviews,
};

/**
 * queryBuilder
 * Returns the object representation of the filter key supplied to the getter method
 * @returns {QueryBuilder}
 */
export default {
  /**
   * getter for the query builder object
   * @param {string} key
   * @param {string|JSON} value stringified JSON object
   * @returns {object} filter object representation
   * @throws {Error} if key is not supported
   */
  get(key, value = 'true') {
    if (!query[key]) {
      throw Error(`Key '${key}' is not supported`);
    }

    try {
      const jsonParsedValue = JSON.parse(value);
      return query[key](jsonParsedValue);
    } catch (e) {
      if (e instanceof SyntaxError) {
        return query[key](value);
      }

      throw e;
    }
  },
};
