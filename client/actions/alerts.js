
import { createAction } from 'redux-actions';
import { REMOVE_ALERT, CREATE_ALERT } from '../reducers/alerts';

export const showAlert = createAction(CREATE_ALERT);
export const hideAlert = createAction(REMOVE_ALERT);
