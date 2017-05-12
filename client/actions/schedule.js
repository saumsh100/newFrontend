
import { createAction } from 'redux-actions';
import {
  ADD_SCHEDULE_FILTER,
  REMOVE_SCHEDULE_FILTER,
  CLEAR_SCHEDULE_FILTER,
  ADD_ALL_SCHEDULE_FILTER,
  SET_SCHEDULE_DATE,
} from '../constants';

export const setScheduleDate = createAction(SET_SCHEDULE_DATE)
export const addScheduleFilter = createAction(ADD_SCHEDULE_FILTER);
export const removeScheduleFilter = createAction(REMOVE_SCHEDULE_FILTER);
export const addAllScheduleFilter = createAction(ADD_ALL_SCHEDULE_FILTER);
export const clearScheduleFilter = createAction(CLEAR_SCHEDULE_FILTER);


