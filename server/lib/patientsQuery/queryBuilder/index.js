
import birthDate from './birthDate';
import dueForHygieneDate from './dueForHygieneDate';
import dueForRecallExamDate from './dueForRecallExamDate';
import firstName from './firstName';
import lastName from './lastName';
import age from './age';
import gender from './gender';
import city from './city';
import email from './email';
import status from './status';
import firstAppointment from './firstApptDate';
import lastAppointment from './lastApptDate';
import nextAppointment from './nextApptDate';
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
import pmsCreatedAt from './pmsCreatedAt';
import sentRecalls from './sentRecalls';
import sentReminders from './sentReminders';
import recallCommunicationPreference from './recallCommunicationPreference';
import reminderCommunicationPreference from './reminderCommunicationPreference';
import reviewCommunicationPreference from './reviewCommunicationPreference';
import emailCommunicationPreference from './emailCommunicationPreference';
import smsCommunicationPreference from './smsCommunicationPreference';
import phoneCommunicationPreference from './phoneCommunicationPreference';
import patientFollowUps from './patientFollowUps';

const query = {
  birthDate,
  dueForHygieneDate,
  dueForRecallExamDate,
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
  mobilePhoneNumber,
  homePhoneNumber,
  workPhoneNumber,
  otherPhoneNumber,
  pmsCreatedAt,
  sentRecalls,
  sentReminders,
  recallCommunicationPreference,
  reminderCommunicationPreference,
  reviewCommunicationPreference,
  emailCommunicationPreference,
  smsCommunicationPreference,
  phoneCommunicationPreference,
  patientFollowUps,
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
