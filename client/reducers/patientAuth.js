
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  LOGIN_SUCCESS,
  LOGOUT,
  SET_PATIENT_USER,
} from '../constants';

const initialState = fromJS({
  isAuthenticated: false,
  patientUser: null,
  sessionId: null,
});

export default handleActions({
  [LOGIN_SUCCESS](state, { payload }) {
    console.log('loginSuccess');
    console.log(payload);
    const newState = state.merge({
      ...payload,
      isAuthenticated: true,
    });

    console.log('newState', newState.toJS());
    return newState;
  },

  [SET_PATIENT_USER](state, { payload }) {
    return state.set('patientUser', payload);
  },

  [LOGOUT]() {
    return initialState;
  },
}, initialState);
