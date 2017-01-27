
import { Map } from 'immutable';
import each from 'lodash/each';
import { handleActions } from 'redux-actions';
import {
  FETCH_ENTITIES,
  RECEIVE_ENTITIES,
  DELETE_ENTITY,
  ADD_ENTITY,
  UPDATE_ENTITY,
  SEND_MESSAGE_ON_CLIENT,
} from '../constants';
import patients from '../entities/collections/patients';
import Patient from '../entities/models/Patient';
import textMessages from '../entities/collections/textMessages';
import TextMessage from '../entities/models/TextMessage';
import Appointments from '../entities/models/Appointments';
import appointments from '../entities/collections/appointments';
import practitioners from '../entities/collections/practitioners';
import Practitioners from '../entities/models/Practitioners';
import Dialogs from '../entities/models/Dialogs'
import dialogs from '../entities/collections/dialogs';

const initialState = Map({
  // KEYs must map to the response object
  // textMessages: Map(), custom collection because it is specific for each patient COLLECTION
  patients: new patients(),
  textMessages: new textMessages(),
  appointments: new appointments(),
  practitioners: new practitioners(),
  dialogs: new dialogs(),
  // reviews: Reviews(), MODEL
  // listings: Listings(), MODEL
});

const Models = {
  patients: Patient,
  textMessages: TextMessage,
  appointments: Appointments,
  practitioners: Practitioners,
  dialogs: Dialogs,
};

export default handleActions({
  [FETCH_ENTITIES](state, { payload: key }) {
    return state.setIn([key, 'isFetching'], true);
  },

  [RECEIVE_ENTITIES](state, { payload: { entities } }) {
    // TODO: update all appropriate entitites in state
    let newState = state;
    each(entities, (collectionMap, key) => {
      each(collectionMap, (modelData, id) => {
        // newModel will have lastUpdated populated
        const newModel = new Models[key](modelData);
        newState = newState.setIn([key, 'models', id], newModel);
      });
    });

    return newState;
  },

  [DELETE_ENTITY](state, { payload: { key, entity } }) {
    return state.deleteIn([key, 'models', Object.keys(entity[key])[0]]);
  },

  [ADD_ENTITY](state, { payload: { key, entity } }) {
    const id = Object.keys(entity[key])[0];
    const newEntity = entity[key][id];
    const newModel = new Models[key](newEntity);
    debugger;
    return state.setIn([key, 'models', id], newModel);
  },

  [UPDATE_ENTITY](state, { payload: { key, entity } }) {
    const id = Object.keys(entity[key])[0];
    const updatedEntity = entity[key][id];
    const updatedModel = new Models[key](updatedEntity);
    return state.updateIn([key, 'models', id], () => updatedModel);
  },

  [SEND_MESSAGE_ON_CLIENT](state, action) {
    const {
      patientId,
      body,
      createdAt,
    } = action.payload;
    const dialogs = state.dialogs;
    debugger;  
    return state.merge({
      currentDialog: action.payload.currentDialogId,
    });
  },


}, initialState);

/* function updateEntityStateWithEntities(state, key, id, modelData) {
  const entityState = state.get(key);

  if (entityState.get('isCollection')) {
    return state.setIn([key, 'models', id], entityState.getModel()(modelData));
  } else {
    return state.set('')
  }
}*/
