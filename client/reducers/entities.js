
import { Map } from 'immutable';
import each from 'lodash/each';
import { handleActions } from 'redux-actions';
import {
  FETCH_ENTITIES,
  RECEIVE_ENTITIES,
} from '../constants';
import patients from '../entities/collections/patients';
import Patient from '../entities/models/Patient';
import textMessages from '../entities/collections/textMessages';
import TextMessage from '../entities/models/TextMessage';


const initialState = Map({
  // KEYs must map to the response object
  // textMessages: Map(), custom collection because it is specific for each patient COLLECTION
  patients: new patients(),
  textMessages: new textMessages(),
  // reviews: Reviews(), MODEL
  // listings: Listings(), MODEL
});

const Models = {
  patients: Patient,
  textMessages: TextMessage,
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
}, initialState);

/*function updateEntityStateWithEntities(state, key, id, modelData) {
  const entityState = state.get(key);
  
  if (entityState.get('isCollection')) {
    return state.setIn([key, 'models', id], entityState.getModel()(modelData));
  } else {
    return state.set('')
  }
}*/


