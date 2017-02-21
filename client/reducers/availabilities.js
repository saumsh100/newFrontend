import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SIX_DAYS_SHIFT,
  SET_DAY,
  SET_PRACTITIONER,
  SET_SERVICE,
  CREATE_PATIENT,
  SET_STARTING_APPOINTMENT_TIME,
  SET_REGISTRATION_STEP,
} from '../constants';

const initialState = fromJS({
  practitionerId: null,
  serviceId: null,
  messages: [],
  startsAt: null,
  registrationStep: 1,
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

  [CREATE_PATIENT](state, action) {
    const { firstName, lastName } = action.payload;
    return state.merge({
      messages: [`Patient ${firstName} ${lastName} has been registered`]
    })
  },

  [SET_STARTING_APPOINTMENT_TIME](state, action) {
    const startsAt = action.payload;
    return state.merge({
      startsAt: startsAt,
    }) 
  },

  [SET_REGISTRATION_STEP](state, action) {
    const registrationStep = action.payload;
    return state.merge({
      registrationStep,
    })
  },

}, initialState);
