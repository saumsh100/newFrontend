import omit from 'lodash/omit';
import { Patient, Event } from '../../_models';
import { fetchAppointmentEvents, buildAppointmentEvent } from './appointments';
import { fetchCallEvents, buildCallEvent } from './calls';
import { fetchReminderEvents, buildReminderEvent } from './reminders';
import { fetchRecallEvents, buildRecallEvent } from './recalls';
import { fetchRequestEvents, buildRequestEvent } from './requests';
import { fetchReviewEvents, buildReviewEvent } from './reviews';
import {
  fetchPatientDueDateEvents,
  buildNewPatientEvent,
  buildPatientDueDateEvent,
} from './patient';

const eventFuncs = {
  appointments: [fetchAppointmentEvents, buildAppointmentEvent],
  calls: [fetchCallEvents, buildCallEvent],
  reminders: [fetchReminderEvents, buildReminderEvent],
  recalls: [fetchRecallEvents, buildRecallEvent],
  requests: [fetchRequestEvents, buildRequestEvent],
  reviews: [fetchReviewEvents, buildReviewEvent],
  dueDate: [fetchPatientDueDateEvents, buildPatientDueDateEvent],
  newPatient: [() => ['newPatient'], buildNewPatientEvent],
};

/**
 * patientEventsAggregator fetches all the events that have occurred for a specific patient.
 * These include requests, reminders, recalls, appointments, etc. You can also retrieve
 * events or exclude certain events.
 * @param patientId {string}
 * @param accountId {string}
 * @param query {object} Filter events by limiting, offsetting, and retrieving
 * or excluding specific events.
 * @returns Events {array}
 */
export default async function patientEventsAggregator(patientId, accountId, query) {
  const { retrieveEventTypes = [], excludeEventTypes = [] } = query;
  const newQuery = omit(query, ['retrieveEventTypes', 'excludeEventTypes']);

  const patientUnclean = await Patient.findById(patientId);
  const patient = patientUnclean.get({ plain: true });

  const params = {
    patient,
    patientId,
    accountId,
    query: newQuery,
  };

  const eventFuncKeys = retrieveEventTypes.length
    ? retrieveEventTypes
    : Object.keys(eventFuncs).filter(ev => excludeEventTypes.indexOf(ev) === -1);

  const allEvents = await Promise.all(eventFuncKeys.map(ev => eventFuncs[ev][0](params)));

  let eventsArray = [];
  allEvents.forEach((events, index) => {
    if (events.length) {
      const constructedEvents = buildAllEvents(eventFuncKeys[index], events, params);
      if (constructedEvents && constructedEvents.length) {
        eventsArray = eventsArray.concat(constructedEvents);
      }
    }
  });

  const sortedEvents = eventsArray.sort((a, b) => new Date(b.metaData.createdAt) - new Date(a.metaData.createdAt));

  return filterEventsByQuery(sortedEvents, newQuery);
}

/**
 * returns an array of Events by calling event builder functions specific to the event type.
 * @param eventType {string}
 * @param events {array}
 * @param params {object}
 */
function buildAllEvents(eventType, events, params) {
  const { patientId, accountId } = params;

  return events.map((data) => {
    const buildData = eventFuncs[eventType][1]({ ...params, data });
    return buildSingleEvent({ ...buildData, patientId, accountId });
  });
}
/**
 * Builds a single event.
 * @param buildData {object}
 */
function buildSingleEvent(buildData) {
  return Event.build(buildData).get({ plain: true });
}

/**
 * filterEventsByQuery takes all events and paginates and limits the amount being fetched.
 * @param eventsArray {array} array of events.
 * @param query {object} limiting and offsetting.
 * @returns Events{array}
 */
function filterEventsByQuery(eventsArray, query) {
  const { limit, offset } = query;

  let filterArray = eventsArray;

  if (offset && eventsArray.length > offset) {
    filterArray = filterArray.slice(offset, eventsArray.length);
  }

  if (limit) {
    filterArray = filterArray.slice(0, limit);
  }

  return filterArray;
}
