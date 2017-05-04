
import { createAction } from 'redux-actions';
import {
  ADD_PRACTITIONER,
  REMOVE_PRACTITIONER,
  SELECT_APPOINMENT_TYPE,
  SET_SCHEDULE_MODE,
  ADD_SCHEDULE_FILTER,
  REMOVE_SCHEDULE_FILTER,
  CLEAR_SCHEDULE_FILTER,
} from '../constants';

export const addPractitionerFilter = createAction(ADD_PRACTITIONER);
export const removePractitionerFilter = createAction(REMOVE_PRACTITIONER);
export const addScheduleFilter = createAction(ADD_SCHEDULE_FILTER);
export const removeScheduleFilter = createAction(REMOVE_SCHEDULE_FILTER);
export const clearScheduleFilter = createAction(CLEAR_SCHEDULE_FILTER);
export const selectAppointmentTypeFilter = createAction(SELECT_APPOINMENT_TYPE);
export const setSheduleModeAction = createAction(SET_SCHEDULE_MODE);
