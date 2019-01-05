
import firstName from './firstName';
import lastName from './lastName';
import age from './age';
import gender from './gender';
import city from './city';
import email from './email';
import status from './status';
import firstApptDate from './firstApptDate';
import lastApptDate from './lastApptDate';
import nextApptDate from './nextApptDate';
import production from './production';
import bookedAppointments from './bookedAppointments';
import onlineAppointments from './onlineAppointments';
import practitioner from './practitioner';
import lastReminder from './lastReminder';
import lastRecall from './lastRecall';
import reviews from './reviews';
import mobilePhoneNumber from './mobilePhoneNumber';
import homePhoneNumber from './homePhoneNumber';
import workPhoneNumber from './workPhoneNumber';
import otherPhoneNumber from './otherPhoneNumber';

const query = {
  firstName,
  lastName,
  age,
  gender,
  city,
  email,
  status,
  firstApptDate,
  lastApptDate,
  nextApptDate,
  production,
  bookedAppointments,
  onlineAppointments,
  practitioner,
  lastReminder,
  lastRecall,
  reviews,
  mobilePhoneNumber,
  homePhoneNumber,
  workPhoneNumber,
  otherPhoneNumber,
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
