
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_CURRENT_PATIENT,
  SET_PATIENTS_FILTER
} from '../constants';

const initialState = fromJS({
  currentPatient: null,
  	filters: {
		patientName: null,
	}
});

export default handleActions({
  [SET_CURRENT_PATIENT](state, action) {
    return state.merge({
      currentPatient: action.payload.currentDialogId,
    });
  },

  [SET_PATIENTS_FILTER](state, action) {
    return state.merge({
      filters: {
      	patientName: action.payload.patientName,
      },
    });
  },
}, initialState);
