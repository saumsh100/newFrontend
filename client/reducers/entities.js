
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  FETCH_ENTITIES,
  RECEIVE_ENTITIES,
} from '../constants';

const initialState = Map({
  // KEYs must map to the response object
  // textMessages: Map(), custom collection because it is specific for each patient COLLECTION
  // patients: Collection(Patient), COLLECTION
  // reviews: Reputation(), MODEL
  // listings: Listings(), MODEL
});

export default handleActions({
  [FETCH_ENTITIES](state, { payload: collectionName }) {
    return state.update(collectionName, { isFetching: true });
  },
  
  [RECEIVE_ENTITIES](state, { payload: entities }) {
    // TODO: update all appropriate entitites in state
    return state;
  },
}, initialState);
