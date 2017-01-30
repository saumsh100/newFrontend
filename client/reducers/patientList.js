
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_CURRENT_PATIENT,
} from '../constants';

const initialState = fromJS({
  currentPatient: null,
});

export default handleActions({
  [SET_CURRENT_PATIENT](state, action) {
    return state.merge({
      currentPatient: action.payload.currentDialogId,
    });
  },

}, initialState);
