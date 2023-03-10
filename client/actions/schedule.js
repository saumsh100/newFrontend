import { createAction } from 'redux-actions';
import {
  ADD_SCHEDULE_FILTER,
  REMOVE_SCHEDULE_FILTER,
  CLEAR_SCHEDULE_FILTER,
  ADD_ALL_SCHEDULE_FILTER,
  SET_SCHEDULE_DATE,
  SELECT_APPOINTMENT,
  REJECT_APPOINTMENT,
  SELECT_WAITSPOT,
  SET_SYNCING,
  SET_MERGING,
  SET_SCHEDULE_VIEW,
  CREATE_NEW_PATIENT,
  REJECT,
  SET_IS_SELECT_APPOINTMENT_DBCLICK,
  SET_NOTIFICATION,
  SET_IS_OPEN_WAITLIST,
  SET_CANCELATION_LIST,
  CANCELLATION_LIST,
  SELECTED_CANCELLATION_LIST_ID,
} from '../constants';

export const setMergingPatient = createAction(SET_MERGING);
export const setScheduleDate = createAction(SET_SCHEDULE_DATE);
export const selectAppointment = createAction(SELECT_APPOINTMENT);
export const rejectAppointment = createAction(REJECT_APPOINTMENT);
export const setSelectedWaitSpot = createAction(SELECT_WAITSPOT);
export const addScheduleFilter = createAction(ADD_SCHEDULE_FILTER);
export const removeScheduleFilter = createAction(REMOVE_SCHEDULE_FILTER);
export const addAllScheduleFilter = createAction(ADD_ALL_SCHEDULE_FILTER);
export const clearScheduleFilter = createAction(CLEAR_SCHEDULE_FILTER);
export const setSyncingWithPMS = createAction(SET_SYNCING);
export const setScheduleView = createAction(SET_SCHEDULE_VIEW);
export const setCreatingPatient = createAction(CREATE_NEW_PATIENT);
export const setReject = createAction(REJECT);
export const setIsSelectAppointmentDbClick = createAction(SET_IS_SELECT_APPOINTMENT_DBCLICK);
export const setNotification = createAction(SET_NOTIFICATION);
export const setWaitlistOpen = createAction(SET_IS_OPEN_WAITLIST);
export const setCancellationListData = createAction(CANCELLATION_LIST);
export const setSelectedCancellationId = createAction(SELECTED_CANCELLATION_LIST_ID)
export const setCancelationList = createAction(SET_CANCELATION_LIST);
