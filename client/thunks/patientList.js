import {
	setCurrentPatientAction,
} from '../actions/dialogs';

export function setCurrentPatient(currentDialogId) {
  return function (dispatch, getState) {
    dispatch(setCurrentPatientAction({ currentDialogId }));
  };
}
