import {
	setCurrentPatientAction,
	setPatientsFilterAction,
} from '../actions/patientList';

export function setCurrentPatient(currentDialogId) {
  return function (dispatch, getState) {
    dispatch(setCurrentPatientAction({ currentDialogId }));
  };
}

export function setPatientsFilter(patientName) {
  return function (dispatch, getState) {
    dispatch(setPatientsFilterAction({ patientName }));
  };	
}
