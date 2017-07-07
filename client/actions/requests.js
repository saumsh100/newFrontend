
import { createAction } from 'redux-actions';
import {
  SET_HOVER_REQUEST_ID,
  SET_REQUEST_COUNT,
  SET_UNDO_REQUEST,
} from '../constants';

export const setHoverRequestId = createAction(SET_HOVER_REQUEST_ID);
export const setRequestCount = createAction(SET_REQUEST_COUNT);
export const setUndoRequest = createAction(SET_UNDO_REQUEST);

