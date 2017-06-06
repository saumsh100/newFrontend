
import { createAction } from 'redux-actions';
import {
  SET_HOVER_REQUEST_ID,
  SET_REQUEST_COUNT,
} from '../constants';

export const setHoverRequestId = createAction(SET_HOVER_REQUEST_ID);
export const setRequestCount = createAction(SET_REQUEST_COUNT);

