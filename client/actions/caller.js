
import { createAction } from 'redux-actions';

export const SET_SELECTED_CALL_ID = 'SET_SELECTED_CALL_ID';
export const UNSET_SELECTED_CALL_ID = 'UNSET_SELECTED_CALL_ID';


export const setSelectedCallId = createAction(SET_SELECTED_CALL_ID);
export const unsetSelectedCallId = createAction(UNSET_SELECTED_CALL_ID);
