
import { createAction } from 'redux-actions';

const SHOW_ALERT = 'SHOW_ALERT';
const HIDE_ALERT = 'HIDE_ALERT';
const DELETE_ALERT = 'DELETE_ALERT';

export const showAlert = createAction(SHOW_ALERT);
export const hideAlert = createAction(HIDE_ALERT);
export const deleteAlert = createAction(DELETE_ALERT);
