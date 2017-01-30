import {
	setCurrentDialogAction,
	sendMessageOnClientAction
} from '../actions/dialogs';

export function setCurrentDialog(currentDialogId) {
  return function (dispatch, getState) {
    dispatch(setCurrentDialogAction({ currentDialogId }));
  };
}
