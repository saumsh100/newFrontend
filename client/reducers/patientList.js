
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_CURRENT_PATIENT,
  SET_PATIENTS_FILTER,
  UPDATE_EDITING_PATIENT_STATE,
  CHANGE_PATIENT_INFO,
} from '../constants';

const initialState = fromJS({
  currentPatient: null,
  filters: {
		patientName: null,
	},
  editingPatientState: {

  }
});

export default handleActions({
  [SET_CURRENT_PATIENT](state, action) {
    return state.merge({

      currentPatient: action.payload.currentDialogId,
    });
  },

  [UPDATE_EDITING_PATIENT_STATE](state, action) {
    const { id, activeTabIndex, isEditing, title } = action.payload;
    const editingPatientState = state.toJS().editingPatientState;
    if (!editingPatientState[id]) editingPatientState[id] = {}
    if (!editingPatientState[id][title]) editingPatientState[id][title] = {}
    const hasIsEditing = action.payload.hasOwnProperty('isEditing');
    const hasTabIndexProperty = action.payload.hasOwnProperty('activeTabIndex');
    if (hasTabIndexProperty) {
      editingPatientState[id]["activeTabIndex"] = activeTabIndex;
    }
    if (hasIsEditing) {
      editingPatientState[id][title]["isEditing"] = isEditing;
    }
    return state.merge({
      editingPatientState: editingPatientState,
    });
  },

  [CHANGE_PATIENT_INFO](state, action) {
    const {
      firstName,
      lastName,
      middleName,
      birthday,
      language,
      gender
    } = action.payload;


  }

}, initialState);
