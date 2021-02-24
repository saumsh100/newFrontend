
import { Map } from 'immutable';
import each from 'lodash/each';
import { handleActions, createAction } from 'redux-actions';
import Account from '../entities/models/Account';
import accounts from '../entities/collections/accounts';
import Address from '../entities/models/Address';
import addresses from '../entities/collections/addresses';
import Enterprise from '../entities/models/Enterprise';
import EnterpriseDashboard from '../entities/models/EnterpriseDashboard';
import enterprises from '../entities/collections/enterprises';
import Patient from '../entities/models/Patient';
import patients from '../entities/collections/patients';
import textMessages from '../entities/collections/textMessages';
import TextMessage from '../entities/models/TextMessage';
import Appointments from '../entities/models/Appointments';
import appointments from '../entities/collections/appointments';
import events from '../entities/collections/events';
import Event from '../entities/models/Event';
import patientTimelineEvents from '../entities/collections/patientTimelineEvents';
import PatientTimelineEvent from '../entities/models/PatientTimelineEvent';
import invites from '../entities/collections/invites';
import Invites from '../entities/models/Invites';
import patientUsers from '../entities/collections/patientUsers';
import PatientUser from '../entities/models/PatientUser';
import practitioners from '../entities/collections/practitioners';
import Practitioners from '../entities/models/Practitioners';
import permissions from '../entities/collections/permissions';
import Permission from '../entities/models/Permission';
import TimeOff from '../entities/models/PractitionerTimeOff';
import timeOffs from '../entities/collections/practitionerTimeOffs';
import PractitionerRecurringTimeOff from '../entities/models/PractitionerRecurringTimeOff';
import practitionerRecurringTimeOffs from '../entities/collections/PractitionerRecurringTimeOffs';
import Requests from '../entities/models/Request';
import requests from '../entities/collections/requests';
import Dialogs from '../entities/models/Dialogs';
import dialogs from '../entities/collections/dialogs';
import Service from '../entities/models/Service';
import services from '../entities/collections/services';
import Segment from '../entities/models/Segment';
import segments from '../entities/collections/segments';
import Calls from '../entities/models/Call';
import calls from '../entities/collections/calls';
import Chairs from '../entities/models/Chair';
import chairs from '../entities/collections/chairs';
import chat from '../entities/collections/chat';
import Chat from '../entities/models/Chat';
import availabilities from '../entities/collections/availabilities';
import Availability from '../entities/models/Availability';
import waitSpots from '../entities/collections/waitSpots';
import WaitSpot from '../entities/models/WaitSpot';
import weeklySchedules from '../entities/collections/weeklySchedules';
import WeeklySchedule from '../entities/models/WeeklySchedule';
import User from '../entities/models/User';
import users from '../entities/collections/users';
import Reminder from '../entities/models/Reminder';
import reminders from '../entities/collections/reminders';
import SentReminder from '../entities/models/SentReminder';
import sentReminders from '../entities/collections/sentReminders';
import Recall from '../entities/models/Recall';
import recalls from '../entities/collections/recalls';
import SentRecall from '../entities/models/SentRecall';
import sentRecalls from '../entities/collections/sentRecalls';

const reducer = '@entities';
export const FETCH_ENTITIES = `${reducer}/FETCH_ENTITIES`;
export const RECEIVE_ENTITIES = `${reducer}/RECEIVE_ENTITIES`;
export const DELETE_ENTITY = `${reducer}/DELETE_ENTITY`;
export const DELETE_ALL_ENTITY = `${reducer}/DELETE_ALL_ENTITY`;
export const UPDATE_ENTITY = `${reducer}/UPDATE_ENTITY`;
export const UPDATE_PATIENT_IN_PATIENT_LIST = `${reducer}/UPDATE_PATIENT_IN_PATIENT_LIST`;

export const fetchEntities = createAction(FETCH_ENTITIES);
export const receiveEntities = createAction(RECEIVE_ENTITIES);
export const deleteEntity = createAction(DELETE_ENTITY);
export const deleteAllEntity = createAction(DELETE_ALL_ENTITY);
export const updateEntity = createAction(UPDATE_ENTITY);
export const updatePatientInPatientList = createAction(UPDATE_PATIENT_IN_PATIENT_LIST);

export const createInitialEntitiesState = (initialEntitiesState = {}) =>
  receiveEntitiesState(
    Map({
      // KEYs must map to the response object
      // textMessages: Map(), custom collection because it is specific for each patient COLLECTION
      accounts: new accounts(),
      addresses: new addresses(),
      enterprises: new enterprises(),
      textMessages: new textMessages(),
      appointments: new appointments(),
      requests: new requests(),
      services: new services(),
      permissions: new permissions(),
      invites: new invites(),
      practitioners: new practitioners(),
      availabilities: new availabilities(),
      dialogs: new dialogs(),
      patients: new patients(),
      calls: new calls(),
      chairs: new chairs(),
      chats: new chat(),
      waitSpots: new waitSpots(),
      weeklySchedules: new weeklySchedules(),
      users: new users(),
      timeOffs: new timeOffs(),
      practitionerRecurringTimeOffs: new practitionerRecurringTimeOffs(),
      reminders: new reminders(),
      sentReminders: new sentReminders(),
      segments: new segments(),
      recalls: new recalls(),
      sentRecalls: new sentRecalls(),
      patientUsers: new patientUsers(),
      events: new events(),
      patientTimelineEvents: new patientTimelineEvents(),

      // reviews: Reviews(), MODEL
      // listings: Listings(),
    }),
    initialEntitiesState,
  );

const Models = {
  accounts: Account,
  addresses: Address,
  enterprises: Enterprise,
  textMessages: TextMessage,
  appointments: Appointments,
  events: Event,
  requests: Requests,
  services: Service,
  permissions: Permission,
  invites: Invites,
  practitioners: Practitioners,
  practitionerRecurringTimeOffs: PractitionerRecurringTimeOff,
  patientTimelineEvents: PatientTimelineEvent,
  timeOffs: TimeOff,
  dialogs: Dialogs,
  patients: Patient,
  calls: Calls,
  chairs: Chairs,
  chats: Chat,
  availabilities: Availability,
  waitSpots: WaitSpot,
  weeklySchedules: WeeklySchedule,
  users: User,
  reminders: Reminder,
  sentReminders: SentReminder,
  recalls: Recall,
  sentRecalls: SentRecall,
  segments: Segment,
  patientUsers: PatientUser,
  enterpriseDashboard: EnterpriseDashboard,
};

export default handleActions(
  {
    [FETCH_ENTITIES](state, { payload: key }) {
      return state.setIn([key, 'isFetching'], true);
    },

    [RECEIVE_ENTITIES](state, { payload: { entities, merge } }) {
      return receiveEntitiesState(state, entities, merge);
    },

    [DELETE_ENTITY](state, { payload: { key, id } }) {
      const newState = state;
      const model = newState.getIn([key, 'models', id]);
      if (model) {
        return newState.deleteIn([key, 'models', id]);
      }

      return state;
    },

    [DELETE_ALL_ENTITY](state, { payload }) {
      const newState = state;
      const model = newState.getIn([payload, 'models']);
      if (model) {
        return newState.deleteIn([payload, 'models']);
      }

      return state;
    },

    [UPDATE_ENTITY](state, { payload: { key, entity } }) {
      const [id] = Object.keys(entity.entities[key]);
      const updatedEntity = entity.entities[key][id];
      const updatedModel = new Models[key](updatedEntity);
      return state.updateIn([key, 'models', id], () => updatedModel);
    },
  },
  createInitialEntitiesState(),
);

function receiveEntitiesState(state, entities, hardMerge) {
  // TODO: update all appropriate entitites in state
  if (!entities) return state;
  let newState = state;
  each(entities, (collectionMap, key) => {
    each(collectionMap, (modelData, id) => {
      const model = newState.getIn([key, 'models', id]);
      // TODO: Fix weeklySchedules merge issues
      if (
        !hardMerge
        && (!model
          || key === 'weeklySchedules'
          || key === 'patients'
          || key === 'chats'
          || key === 'textMessages'
          || key === 'patientTimelineEvents')
      ) {
        const newModel = new Models[key](modelData);
        newState = newState.setIn([key, 'models', id], newModel);
      } else {
        newState = newState.mergeIn([key, 'models', id], modelData);
      }
    });
  });

  return newState;
}
