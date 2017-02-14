
import { createAction } from 'redux-actions';
import {
	SET_CURRENT_DIALOG,
	SET_DIALOG_SCROLL_PERMISSION,
} from '../constants';

export const setCurrentDialogAction = createAction(SET_CURRENT_DIALOG);
export const setDialogScrollPermissionAction = createAction(SET_DIALOG_SCROLL_PERMISSION);
