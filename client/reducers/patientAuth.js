
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  LOGIN_SUCCESS,
  LOGOUT,
  SET_PATIENT_USER,
  SET_RESET_EMAIL,
} from '../constants';

const initialState = fromJS({
  isAuthenticated: false,
  patientUser: null,
  sessionId: null,
  resetEmail: null,
});

export default handleActions({
  [LOGIN_SUCCESS](state, { payload }) {
    return state.merge({
      ...payload,
      isAuthenticated: true,
    });
  },

  [SET_RESET_EMAIL](state, { payload }) {
    return state.set('resetEmail', payload);
  },

  [SET_PATIENT_USER](state, { payload }) {
    return state.set('patientUser', payload);
  },

  [LOGOUT]() {
    return initialState;
  },
}, initialState);
