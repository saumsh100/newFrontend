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

export function setDialogsFilter(username) {
  return function (dispatch, getState) {
    dispatch(setDialogsFilterAction({ username }));
  };
}
