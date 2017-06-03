import {
	setCurrentDialogAction,
	sendMessageOnClientAction,
  setDialogScrollPermissionAction,
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

export function setDialogScrollPermission(allowDialogScroll) {
	return function (dispatch, getState) {
		dispatch(setDialogScrollPermissionAction({ allowDialogScroll }));
	}
}
