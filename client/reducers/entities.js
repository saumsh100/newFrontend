
import { Map, fromJS } from 'immutable';
import each from 'lodash/each';
import { handleActions } from 'redux-actions';
import {
  FETCH_ENTITIES,
  RECEIVE_ENTITIES,
  DELETE_ENTITY,
  ADD_ENTITY,
  UPDATE_ENTITY,
  SEND_MESSAGE_ON_CLIENT,
  READ_MESSAGES_IN_CURRENT_DIALOG,
  UPDATE_PATIENT_IN_PATIENT_LIST,
  ADD_SOCKET_ENTITY,
} from '../constants';
import Account from '../entities/models/Account';
import accounts from '../entities/collections/accounts';
import Enterprise from '../entities/models/Enterprise';
import enterprises from '../entities/collections/enterprises';
import patients from '../entities/collections/patients';
import Patient from '../entities/models/Patient';
import textMessages from '../entities/collections/textMessages';
import TextMessage from '../entities/models/TextMessage';
import Appointments from '../entities/models/Appointments';
import appointments from '../entities/collections/appointments';
import invites from '../entities/collections/invites';
import Invites from '../entities/models/Invites';
import practitioners from '../entities/collections/practitioners';
import Practitioners from '../entities/models/Practitioners';
import permissions from '../entities/collections/permissions';
import Permission from '../entities/models/Permission';
import TimeOff from '../entities/models/PractitionerTimeOff';
import timeOffs from '../entities/collections/practitionerTimeOffs';
import Requests from '../entities/models/Request';
import requests from '../entities/collections/requests';
import Dialogs from '../entities/models/Dialogs';
import dialogs from '../entities/collections/dialogs';
import PatientList from '../entities/models/PatientList';
import patientList from '../entities/collections/patientList';
import Service from '../entities/models/Service';
import services from '../entities/collections/services';
import Chairs from '../entities/models/Chair';
import chairs from '../entities/collections/chairs';
import availabilities from '../entities/collections/availabilities';
import Availability from '../entities/models/Availability';
import weeklySchedules from '../entities/collections/weeklySchedules';
import WeeklySchedule from '../entities/models/WeeklySchedule';
import User from '../entities/models/User';
import users from '../entities/collections/users';

export const createInitialEntitiesState = (initialEntitiesState = {}) => {
  return receiveEntities(Map({
    // KEYs must map to the response object
    // textMessages: Map(), custom collection because it is specific for each patient COLLECTION
    accounts: new accounts(),
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
    patient: new patients(),
    patients: new patientList(),
    chairs: new chairs(),
    weeklySchedules: new weeklySchedules(),
    users: new users(),
    timeOffs: new timeOffs(),
    // reviews: Reviews(), MODEL
    // listings: Listings(),
  }), initialEntitiesState);
};

const Models = {
  accounts: Account,
  enterprises: Enterprise,
  textMessages: TextMessage,
  appointments: Appointments,
  requests: Requests,
  services: Service,
  permissions: Permission,
  invites: Invites,
  practitioners: Practitioners,
  timeOffs: TimeOff,
  dialogs: Dialogs,
  patient: Patient,
  patients: PatientList,
  chairs: Chairs,
  availabilities: Availability,
  weeklySchedules: WeeklySchedule,
  users: User,
};

export default handleActions({
  [FETCH_ENTITIES](state, { payload: key }) {
    return state.setIn([key, 'isFetching'], true);
  },

  [RECEIVE_ENTITIES](state, { payload: { entities } }) {
    return receiveEntities(state, entities);
  },

  [DELETE_ENTITY](state, { payload: { key, id } }) {
    return state.deleteIn([key, 'models', id]);
  },

  [ADD_ENTITY](state, { payload: { key, entity } }) {
    const id = Object.keys(entity[key])[0];
    const addEntity = entity[key][id];
    const newModel = new Models[key](addEntity);
    return state.setIn([key, 'models', id], newModel);
  },

  [UPDATE_ENTITY](state, { payload: { key, entity } }) {
    const id = Object.keys(entity[key])[0];
    const updatedEntity = entity[key][id];
    const updatedModel = new Models[key](updatedEntity);
    return state.updateIn([key, 'models', id], () => updatedModel);
  },

  [ADD_SOCKET_ENTITY](state, { payload: {key, entity } }){
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
    const currentDialog = dialogs.models[dialogId]
    const dialog = fromJS(currentDialog);
    const dialogMessages = currentDialog.messages
      .map(m => m)
    const unreadCount = currentDialog.unreadCount;
    dialogMessages[messageIndex].read = true
    const updatedMessagesDialog = dialog.updateIn(['messages'], () => dialogMessages);
    const updatedDialog = updatedMessagesDialog.updateIn(['unreadCount'], () => unreadCount-1).toJS();
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
        objectToMergeWith = fromJS({ insurance: { insurance, memberId, contract, carrier, sin, id }});
      break;

    }
    const updatedPatient = fromJS(currentPatient).mergeDeep(objectToMergeWith)
    return state.updateIn(['patientList', 'models', id], () => updatedPatient.toJS());
  }

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
      if (!model || key === 'weeklySchedules') {
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
