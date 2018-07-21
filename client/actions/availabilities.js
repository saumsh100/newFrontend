
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
  SET_CONFIRM_AVAILABILITY,
  SET_NEXT_AVAILABILITY,
  SET_IS_CONFIRMING,
  SET_IS_LOGIN,
  SET_IS_TIMER_EXPIRED,
  SET_PATIENT_USER,
  SET_IS_SUCCESSFUL_BOOKING,
  REFRESH_AVAILABILITIES_STATE,
  SET_HAS_WAITLIST,
  UPDATE_WAITSPOT,
  SET_FORGOT_PASSWORD,
  SET_NOTES,
  SET_INSURANCE_MEMBER_ID,
  SET_INSURANCE_CARRIER,
  SET_SENTRECALLID,
  SET_DUE_DATE,
  SET_FAMILY_PATIENT_USER,
  SET_IS_BOOKING,
  RESET_WAITLIST,
  SET_WAITLIST_TIMES,
  SET_WAITLIST_DATES,
  SET_WAITLIST_UNAVAILABLE_DATES,
  SET_TIMEFRAME,
} from '../constants';

export const sixDaysShiftAction = createAction(SIX_DAYS_SHIFT);
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
export const setConfirmAvailability = createAction(SET_CONFIRM_AVAILABILITY);
export const setNextAvailability = createAction(SET_NEXT_AVAILABILITY);
export const setIsConfirming = createAction(SET_IS_CONFIRMING);
export const setIsLogin = createAction(SET_IS_LOGIN);
export const setForgotPassword = createAction(SET_FORGOT_PASSWORD);
export const setIsTimerExpired = createAction(SET_IS_TIMER_EXPIRED);
export const setIsSuccessfulBooking = createAction(SET_IS_SUCCESSFUL_BOOKING);
export const refreshAvailabilitiesState = createAction(REFRESH_AVAILABILITIES_STATE);
export const resetWaitlist = createAction(RESET_WAITLIST);
export const setHasWaitList = createAction(SET_HAS_WAITLIST);
export const setWaitlistTimes = createAction(SET_WAITLIST_TIMES);
export const setWaitlistDates = createAction(SET_WAITLIST_DATES);
export const setWaitlistUnavailableDates = createAction(SET_WAITLIST_UNAVAILABLE_DATES);
export const updateWaitSpot = createAction(UPDATE_WAITSPOT);
export const setNotes = createAction(SET_NOTES);
export const setFamilyPatientUser = createAction(SET_FAMILY_PATIENT_USER);
export const setInsuranceMemberId = createAction(SET_INSURANCE_MEMBER_ID);
export const setInsuranceCarrier = createAction(SET_INSURANCE_CARRIER);
export const setSentRecallId = createAction(SET_SENTRECALLID);
export const setDueDate = createAction(SET_DUE_DATE);
export const setIsBooking = createAction(SET_IS_BOOKING);
export const setTimeFrame = createAction(SET_TIMEFRAME);

// This is on the auth reducer!
export const setPatientUser = createAction(SET_PATIENT_USER);
