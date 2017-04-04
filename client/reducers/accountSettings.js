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
  [SET_SERVICE_ID](state, action) {
    const serviceId = action.payload.id;
    if (state.get('serviceId') === serviceId) {
      return state;
    }

    return state.set('serviceId', serviceId);
  },

  [SET_PRACTITIONER_ID](state, action) {
    const practitionerId = action.payload.id;
    if (state.get('practitionerId') === practitionerId) {
      return state;
    }

    return state.set('practitionerId', practitionerId);
  },
}, initialState);