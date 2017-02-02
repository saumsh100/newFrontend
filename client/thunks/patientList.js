import {
	setCurrentPatientAction,
} from '../actions/patientList';

export function setCurrentPatient(currentDialogId) {
  return function (dispatch, getState) {
    dispatch(setCurrentPatientAction({ currentDialogId }));
  };
}
