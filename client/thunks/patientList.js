import {
	setCurrentPatientAction,
	updateEditingPatientStateAction,
} from '../actions/patientList';

export function setCurrentPatient(currentDialogId) {
  return function (dispatch, getState) {
    dispatch(setCurrentPatientAction({ currentDialogId }));
  };
}

export function updateEditingPatientState(patientSate) {
  return function (dispatch, getState) {
    dispatch(updateEditingPatientStateAction(patientSate));
  };
}


