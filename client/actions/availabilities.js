import { createAction } from 'redux-actions';
import {
  SIX_DAYS_SHIFT,
  SET_DAY,
  SET_PRACTITIONER,
  SET_SERVICE,
  CREATE_PATIENT,
  SET_STARTING_APPOINTMENT_TIME,
} from '../constants';

export const sixDaysShiftAction  = createAction(SIX_DAYS_SHIFT);
export const setDayAction = createAction(SET_DAY);
export const setPractitionerAction = createAction(SET_PRACTITIONER);
export const setServiceAction = createAction(SET_SERVICE);
export const createPatientAction = createAction(CREATE_PATIENT);
export const setStartingAppointmentTimeAction= createAction(SET_STARTING_APPOINTMENT_TIME)