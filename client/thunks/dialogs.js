import {
	setCurrentDialogAction,
	sendMessageOnClientAction,
	setDialogsFilterAction,
} from '../actions/dialogs';

export function setCurrentDialog(currentDialogId) {
  return function (dispatch, getState) {
    dispatch(setCurrentDialogAction({ currentDialogId }));
  };
}

export function setDialogsFilter(patientName) {
  return function (dispatch, getState) {
    dispatch(setDialogsFilterAction({ patientName }));
  };
}
