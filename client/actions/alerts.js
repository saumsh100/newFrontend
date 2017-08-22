
import { createAction } from 'redux-actions';
import { REMOVE_ALERT, CREATE_ALERT } from '../reducers/alerts';

export const createAlert = createAction(CREATE_ALERT);
export const removeAlert = createAction(REMOVE_ALERT);
