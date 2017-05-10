
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_SELECTED_PATIENT_ID,
  SEARCH_PATIENT,
  SET_PATIENTS_FILTER,
  UPDATE_EDITING_PATIENT_STATE,
  CHANGE_PATIENT_INFO,
  UPDATE_PATIENT_IN_PATIENT_LIST,
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
  [SET_SELECTED_PATIENT_ID](state, action) {
    console.log('sdsfdsfd', action.payload)
    const id = action.payload;
    return state.set('selectedPatientId', id);
  },

  [SEARCH_PATIENT](state, action) {
    const patients = action.payload;
    return state.set('searchedPatients', patients);
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
      title,
      id,
    } = action.payload;
    const editingPatientState = state.toJS().editingPatientState;
    editingPatientState[id][title]["isEditing"] = false;
    return state.merge({
      editingPatientState: editingPatientState,
    });


  }

}, initialState);
