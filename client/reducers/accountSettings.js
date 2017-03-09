import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_SERVICE_ID,
  SET_PRACTITIONER_ID,
} from '../constants';

const initialState = fromJS({
  serviceId: null,
  practitionerId: null,
})

export default handleActions({
  [SET_SERVICE_ID](state, action){
    return state.merge({
      serviceId: action.payload.id,
    });
  },

  [SET_PRACTITIONER_ID](state, action){
    return state.merge({
      practitionerId: action.payload.id,
    });
  },
}, initialState);