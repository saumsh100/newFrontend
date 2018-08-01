
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { SET_PATIENT_USER } from '../constants';
import PatientUser from '../entities/models/PatientUser';

export const PATIENT_LOGIN_SUCCESS = '@patient-auth/PATIENT_LOGIN_SUCCESS';
export const PATIENT_AUTH_LOGOUT = '@patient-auth/PATIENT_AUTH_LOGOUT';
export const UPDATE_PATIENT_USER = '@patient-auth/UPDATE_PATIENT_USER';
export const SET_FAMILY_PATIENTS = '@patient-auth/SET_FAMILY_PATIENTS';
export const ADD_PATIENT_TO_FAMILY = '@patient-auth/ADD_PATIENT_TO_FAMILY';
export const UPDATE_FAMILY_PATIENT = '@patient-auth/UPDATE_FAMILY_PATIENT';
export const SET_RESET_EMAIL = '@patient-auth/SET_RESET_EMAIL';

export const setFamilyPatients = createAction(SET_FAMILY_PATIENTS);
export const patientLoginSuccess = createAction(PATIENT_LOGIN_SUCCESS);
export const patientAuthLogout = createAction(PATIENT_AUTH_LOGOUT);
export const updatePatientUser = createAction(UPDATE_PATIENT_USER);
export const updateFamilyPatient = createAction(UPDATE_FAMILY_PATIENT);
export const addPatientToFamily = createAction(ADD_PATIENT_TO_FAMILY);
export const setResetEmail = createAction(SET_RESET_EMAIL);

export const createInitialPatientAuth = state =>
  fromJS({
    isAuthenticated: false,
    patientUser: null,
    familyPatients: [],
    sessionId: null,
    resetEmail: null,
    ...state,
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

    [ADD_PATIENT_TO_FAMILY](state, { payload }) {
      return state.update('familyPatients', patients => patients.push(new PatientUser(payload)));
    },

    [SET_PATIENT_USER](state, { payload }) {
      return state.set('patientUser', payload);
    },

    [UPDATE_PATIENT_USER](state, { payload }) {
      return state.update('patientUser', p => p.merge(payload));
    },

    [UPDATE_FAMILY_PATIENT](
      state,
      {
        payload: { patientId, values },
      },
    ) {
      const familyPatients = state.get('familyPatients');

      if (!familyPatients.length) return state;

      return state.updateIn(
        ['familyPatients', familyPatients.findIndex(i => i.id === patientId)],
        p => p.merge(values),
      );
    },

    [SET_FAMILY_PATIENTS](state, { payload }) {
      const familyPatients = fromJS(payload.map(p => new PatientUser(p)));
      return state.set('familyPatients', familyPatients);
    },

    [PATIENT_AUTH_LOGOUT]() {
      return createInitialPatientAuth();
    },
  },
  createInitialPatientAuth(),
);
