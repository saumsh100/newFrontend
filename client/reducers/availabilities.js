
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SIX_DAYS_SHIFT,
  SET_START_DATE,
  SET_SELECTED_PRACTITIONER_ID,
  SET_SELECTED_SERVICE_ID,
  CREATE_PATIENT,
  SET_REGISTRATION_STEP,
  SET_CLINIC_INFO,
  REMOVE_RESERVATION,
  SET_RESERVATION,
  SET_SELECTED_AVAILABILITY,
  SET_IS_FETCHING,
  SET_IS_CONFIRMING,
  SET_IS_TIMER_EXPIRED,
  SET_AVAILABILITIES,
  SET_PATIENT_USER,
  SET_IS_SUCCESSFUL_BOOKING,
  REFRESH_AVAILABILITIES_STATE,
  SET_HAS_WAITLIST,
  UPDATE_WAITSPOT,
} from '../constants';

export const createInitialWidgetState = state => fromJS(Object.assign({
  account: null,
  practitioners: [],
  services: [],
  availabilities: [],
  patientUser: null,
  isFetching: true,
  isConfirming: false,
  isTimerExpired: false,
  isSuccessfulBooking: false,
  hasWaitList: false,
  waitSpot: {
    preferences: {
      mornings: true,
      afternoons: true,
      evenings: true,
      weekdays: true,
      weekends: true,
    },

    unavailableDays: [],
  },

  selectedAvailability: null,
  selectedServiceId: null, // Will be set by the initialState from server
  selectedPractitionerId: '',
  selectedStartDate: (new Date()).toISOString(),
  registrationStep: 1,
  reservationId: null,
}, state));

export default handleActions({
  [REFRESH_AVAILABILITIES_STATE](state) {
    // We can't re-fetch practitioners and services cause they are pulled from server, so don't purge those...
    // We also don't wanna re-set user-selected state because why make them re-select?
    return state.merge({
      selectedAvailability: null,
      isFetching: true,
      isConfirming: false,
      isTimerExpired: false,
      isSuccessfulBooking: false,
      registrationStep: 1,
      reservationId: null,
      hasWaitList: false,
      waitSpot: null,
    });
  },

  [SET_SELECTED_AVAILABILITY](state, action) {
    return state.set('selectedAvailability', action.payload);
  },

  [SET_AVAILABILITIES](state, action) {
    return state.set('availabilities', action.payload);
  },

  [SET_IS_FETCHING](state, action) {
    return state.set('isFetching', action.payload);
  },

  [SET_IS_CONFIRMING](state, action) {
    return state.set('isConfirming', action.payload);
  },

  [SET_IS_TIMER_EXPIRED](state, action) {
    return state.set('isTimerExpired', action.payload);
  },

  [SET_HAS_WAITLIST](state, action) {
    return state.set('hasWaitList', action.payload);
  },

  [UPDATE_WAITSPOT](state, action) {
    return state.mergeIn(['waitSpot'], action.payload);
  },

  [SET_PATIENT_USER](state, action) {
    return state.set('patientUser', action.payload);
  },

  [SET_IS_SUCCESSFUL_BOOKING](state, action) {
    return state.set('isSuccessfulBooking', action.payload);
  },

  [SIX_DAYS_SHIFT](state, action) {
    const { selectedStartDay, selectedEndDay, practitionerId, retrievedFirstTime } = action.payload;
    return state.merge({
      [practitionerId]: { selectedEndDay, selectedStartDay, retrievedFirstTime },
    });
  },

  [SET_SELECTED_SERVICE_ID](state, action) {
    return state.set('selectedServiceId', action.payload);
  },

  [SET_SELECTED_PRACTITIONER_ID](state, action) {
    return state.set('selectedPractitionerId', action.payload);
  },

  [SET_START_DATE](state, action) {
    return state.set('selectedStartDate', action.payload);
  },

  [CREATE_PATIENT](state, action) {
    const { firstName, lastName } = action.payload;
    return state.merge({
      messages: [`Patient ${firstName} ${lastName} has been registered`]
    });
  },

  [SET_REGISTRATION_STEP](state, action) {
    return state.set('registrationStep', action.payload);
  },

  [SET_CLINIC_INFO](state, action) {
    const { address, logo, clinicName, bookingWidgetPrimaryColor } = action.payload;
    return state.merge({
      logo,
      address,
      clinicName,
      bookingWidgetPrimaryColor,
    });
  },

  [SET_RESERVATION](state, action) {
    const reservationId = action.payload;
    return state.merge({
      reservationId,
    })
  },

  [REMOVE_RESERVATION](state, action) {
    return state.merge({
      reservationId: null,
      messages: [`Reserved time for this practitioner has been expired...`]
    })
  },
}, createInitialWidgetState());
