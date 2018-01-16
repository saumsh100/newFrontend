
import { createAction } from 'redux-actions';
import {
  ADD_SCHEDULE_FILTER,
  REMOVE_SCHEDULE_FILTER,
  CLEAR_SCHEDULE_FILTER,
  ADD_ALL_SCHEDULE_FILTER,
  SET_SCHEDULE_DATE,
  SELECT_APPOINTMENT,
  SELECT_WAITSPOT,
  SET_SYNCING,
  SET_MERGING,
  SET_SCHEDULE_VIEW,
  CREATE_NEW_PATIENT,
} from '../constants';

export const setMergingPatient = createAction(SET_MERGING);
export const setScheduleDate = createAction(SET_SCHEDULE_DATE);
export const selectAppointment = createAction(SELECT_APPOINTMENT);
export const setSelectedWaitSpot = createAction(SELECT_WAITSPOT);
export const addScheduleFilter = createAction(ADD_SCHEDULE_FILTER);
export const removeScheduleFilter = createAction(REMOVE_SCHEDULE_FILTER);
export const addAllScheduleFilter = createAction(ADD_ALL_SCHEDULE_FILTER);
export const clearScheduleFilter = createAction(CLEAR_SCHEDULE_FILTER);
export const setSyncingWithPMS = createAction(SET_SYNCING);
export const setScheduleView = createAction(SET_SCHEDULE_VIEW);
export const setCreatingPatient = createAction(CREATE_NEW_PATIENT)

