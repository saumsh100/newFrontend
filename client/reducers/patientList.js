
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import moment from 'moment';
import {
  SET_CURRENT_PATIENT,
} from '../constants';

const initialState = fromJS({
  currentPatient: null,
});

export default handleActions({
  [SET_CURRENT_PATIENT](state, action) {
    return state.merge({
      currentPatient: action.payload.currentPatient,
    });
  },

}, initialState);
