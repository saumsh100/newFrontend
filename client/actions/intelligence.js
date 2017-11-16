
import { createAction } from 'redux-actions';
import {
  QUERY_DATES,
} from '../constants';

export const setQueryDates = createAction(QUERY_DATES);
