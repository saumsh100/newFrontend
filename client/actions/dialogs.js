
import { createAction } from 'redux-actions';
import {
	SET_CURRENT_DIALOG,
	SET_DIALOGS_FILTER
} from '../constants';

export const setCurrentDialogAction = createAction(SET_CURRENT_DIALOG);
export const setDialogsFilterAction = createAction(SET_DIALOGS_FILTER);
