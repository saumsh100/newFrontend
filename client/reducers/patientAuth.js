
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { SET_PATIENT_USER, SET_RESET_EMAIL, SET_FAMILY_PATIENTS } from '../constants';

export const PATIENT_LOGIN_SUCCESS = '@patient-auth/PATIENT_LOGIN_SUCCESS';
export const PATIENT_AUTH_LOGOUT = '@patient-auth/PATIENT_AUTH_LOGOUT';

export const patientLoginSuccess = createAction(PATIENT_LOGIN_SUCCESS);
export const patientAuthLogout = createAction(PATIENT_AUTH_LOGOUT);

const initialState = fromJS({
  isAuthenticated: false,
  patientUser: null,
  familyPatients: [],
  sessionId: null,
  resetEmail: null,
});

export default handleActions(
  {
    [PATIENT_LOGIN_SUCCESS](state, { payload }) {
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

    [SET_FAMILY_PATIENTS](state, { payload }) {
      return state.set('familyPatients', payload);
    },

    [PATIENT_AUTH_LOGOUT]() {
      return initialState;
    },
  },
  initialState,
);
