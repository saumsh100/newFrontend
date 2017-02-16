import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SIX_DAYS_SHIFT,
  SET_DAY,
  SET_PRACTITIONER,
  SET_SERVICE,
} from '../constants';

const initialState = fromJS({
  practitionerId: null,
  serviceId: null,
});

export default handleActions({
  [SIX_DAYS_SHIFT](state, action) {
    const { selectedStartDay, selectedEndDay, practitionerId, retrievedFirstTime } = action.payload;
    return state.merge({
      [practitionerId]: { selectedEndDay, selectedStartDay, retrievedFirstTime },
    });
  },

  [SET_DAY](state, action) {
    return state.merge({

    });
  },

  [SET_PRACTITIONER](state, action) {
    const practitionerObj = state[action.payload.practitionerId];
    return state.merge({
      practitionerId: action.payload.practitionerId,
    })
  },

  [SET_SERVICE](state, action) {
    return state.merge({
      serviceId: action.payload.serviceId,
    })
  },
}, initialState);
