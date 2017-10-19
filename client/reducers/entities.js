
import { Map, fromJS } from 'immutable';
import each from 'lodash/each';
import { handleActions } from 'redux-actions';
import {
  FETCH_ENTITIES,
  RECEIVE_ENTITIES,
  DELETE_ENTITY,
  DELETE_ALL_ENTITY,
  ADD_ENTITY,
  UPDATE_ENTITY,
  SEND_MESSAGE_ON_CLIENT,
  READ_MESSAGES_IN_CURRENT_DIALOG,
  UPDATE_PATIENT_IN_PATIENT_LIST,
  ADD_SOCKET_ENTITY,
} from '../constants';
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

export const createInitialEntitiesState = (initialEntitiesState = {}) => receiveEntities(Map({
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

    // reviews: Reviews(), MODEL
    // listings: Listings(),
}), initialEntitiesState);

const Models = {
  accounts: Account,
  addresses: Address,
  enterprises: Enterprise,
  textMessages: TextMessage,
  appointments: Appointments,
  requests: Requests,
  services: Service,
  permissions: Permission,
  invites: Invites,
  practitioners: Practitioners,
  practitionerRecurringTimeOffs: PractitionerRecurringTimeOff,
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

export default handleActions({
  [FETCH_ENTITIES](state, { payload: key }) {
    return state.setIn([key, 'isFetching'], true);
  },

  [RECEIVE_ENTITIES](state, { payload: { entities } }) {
    return receiveEntities(state, entities);
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

  [ADD_ENTITY](state, { payload: { key, entity } }) {
    const id = Object.keys(entity.entities[key])[0];
    const addEntity = entity.entities[key][id];
    const newModel = new Models[key](addEntity);
    return state.setIn([key, 'models', id], newModel);
  },

  [UPDATE_ENTITY](state, { payload: { key, entity } }) {
    const id = Object.keys(entity.entities[key])[0];
    const updatedEntity = entity.entities[key][id];
    const updatedModel = new Models[key](updatedEntity);
    return state.updateIn([key, 'models', id], () => updatedModel);
  },

  [ADD_SOCKET_ENTITY](state, { payload: { key, entity } }) {
    const id = entity.id;
    const newModel = new Models[key](entity);
    return state.setIn([key, 'models', id], newModel);
  },

  [SEND_MESSAGE_ON_CLIENT](state, action) {
    const { message } = action.payload;
    const objectToMergeWith = fromJS({
      lastMessageText: message.body,
      lastMessageTime: message.createdAt,
    });
    const oldDialog = fromJS(state.toJS().dialogs.models[message.patientId]);
    const mergedDialog = oldDialog.mergeDeep(objectToMergeWith);
    const oldMessages = state.toJS().dialogs.models[message.patientId].messages.map(m => m);
    oldMessages.push(message);
    const resultingDialog = mergedDialog.updateIn(['messages'], () => oldMessages).toJS();
    return state.updateIn(['dialogs', 'models', message.patientId], () => resultingDialog);
  },

  [READ_MESSAGES_IN_CURRENT_DIALOG](state, action) {
    const { messageId, dialogId, messageIndex = 0 } = action.payload;
    const dialogs = state.toJS().dialogs;
    const currentDialog = dialogs.models[dialogId];
    const dialog = fromJS(currentDialog);
    const dialogMessages = currentDialog.messages
      .map(m => m);
    const unreadCount = currentDialog.unreadCount;
    dialogMessages[messageIndex].read = true;
    const updatedMessagesDialog = dialog.updateIn(['messages'], () => dialogMessages);
    const updatedDialog = updatedMessagesDialog.updateIn(['unreadCount'], () => unreadCount - 1).toJS();
    return state.updateIn(['dialogs', 'models', dialogId], () => updatedDialog);
  },

  [UPDATE_PATIENT_IN_PATIENT_LIST](state, action) {
    const { title, id } = action.payload;
    const currentPatient = state.toJS().patientList.models[id];
    let objectToMergeWith = {};
    switch (title) {
      case 'personal':
        const { id, firstName, lastName, gender, language, birthday, middleName, status } = action.payload;
        const name = `${firstName} ${lastName}`;
        objectToMergeWith = fromJS({ name, gender, language, birthday, id, middleName, status });
        break;

      case 'insurance':
        const { insurance, memberId, contract, carrier, sin } = action.payload;
        objectToMergeWith = fromJS({ insurance: { insurance, memberId, contract, carrier, sin, id } });
        break;

    }
    const updatedPatient = fromJS(currentPatient).mergeDeep(objectToMergeWith);
    return state.updateIn(['patientList', 'models', id], () => updatedPatient.toJS());
  },

}, createInitialEntitiesState());

/* function updateEntityStateWithEntities(state, key, id, modelData) {
  const entityState = state.get(key);

  if (entityState.get('isCollection')) {
    return state.setIn([key, 'models', id], entityState.getModel()(modelData));
  } else {
    return state.set('')
  }
}*/

function receiveEntities(state, entities) {
  // TODO: update all appropriate entitites in state
  let newState = state;
  each(entities, (collectionMap, key) => {
    each(collectionMap, (modelData, id) => {
      const model = newState.getIn([key, 'models', id]);
      // TODO: Fix weeklySchedules merge issues
      if (!model || key === 'weeklySchedules' || key === 'patients' || key === 'chats' || key === 'textMessages') {
        // newModel will have lastUpdated populated
        const newModel = new Models[key](modelData);
        newState = newState.setIn([key, 'models', id], newModel);
      } else {
        newState = newState.mergeIn([key, 'models', id], modelData);
      }
    });
  });

  return newState;
}
