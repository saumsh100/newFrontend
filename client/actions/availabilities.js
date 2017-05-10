
import { createAction } from 'redux-actions';
import {
  SIX_DAYS_SHIFT,
  SET_START_DATE,
  SET_SELECTED_SERVICE_ID,
  SET_SELECTED_PRACTITIONER_ID,
  CREATE_PATIENT,
  SET_STARTING_APPOINTMENT_TIME,
  SET_REGISTRATION_STEP,
  SET_CLINIC_INFO,
  SET_RESERVATION,
  REMOVE_RESERVATION,
  SET_SELECTED_AVAILABILITY,
  SET_IS_FETCHING,
  SET_AVAILABILITIES,
  SET_IS_CONFIRMING,
  SET_PATIENT_USER,
  SET_IS_SUCCESSFUL_BOOKING,
} from '../constants';

export const sixDaysShiftAction  = createAction(SIX_DAYS_SHIFT);
export const setSelectedStartDate = createAction(SET_START_DATE);
export const setSelectedPractitionerId = createAction(SET_SELECTED_PRACTITIONER_ID);
export const setSelectedServiceId = createAction(SET_SELECTED_SERVICE_ID);
export const createPatientAction = createAction(CREATE_PATIENT);
export const setStartingAppointmentTimeAction = createAction(SET_STARTING_APPOINTMENT_TIME);
export const setRegistrationStepAction = createAction(SET_REGISTRATION_STEP);
export const setClinicInfoAction = createAction(SET_CLINIC_INFO);
export const setTemporaryReservationAction = createAction(SET_RESERVATION);
export const removeReservationAction = createAction(REMOVE_RESERVATION);
export const setSelectedAvailability = createAction(SET_SELECTED_AVAILABILITY);
export const setIsFetching = createAction(SET_IS_FETCHING);
export const setAvailabilities = createAction(SET_AVAILABILITIES);
export const setIsConfirming = createAction(SET_IS_CONFIRMING);
export const setPatientUser = createAction(SET_PATIENT_USER);
export const setIsSuccessfulBooking = createAction(SET_IS_SUCCESSFUL_BOOKING);
