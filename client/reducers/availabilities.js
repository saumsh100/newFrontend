
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SIX_DAYS_SHIFT,
  SET_START_DATE,
  SET_SELECTED_PRACTITIONER_ID,
  SET_SELECTED_SERVICE_ID,
  CREATE_PATIENT,
  SET_STARTING_APPOINTMENT_TIME,
  SET_REGISTRATION_STEP,
  SET_CLINIC_INFO,
  REMOVE_RESERVATION,
  SET_RESERVATION,
  SET_SELECTED_AVAILABILITY,
  SET_IS_FETCHING,
  SET_AVAILABILITIES,
} from '../constants';

export const createInitialWidgetState = state => fromJS(Object.assign({
  account: null,
  practitioners: [],
  services: [],
  availabilities: [],
  isFetching: true,
  selectedAvailability: null,
  selectedServiceId: null, // Will be set by the initialState from server
  selectedPractitionerId: '',
  selectedStartDate: (new Date()).toISOString(),
  messages: [],
  startsAt: null,
  registrationStep: 1,
  logo: null,
  address: null,
  clinicName: null,
  bookingWidgetPrimaryColor: null,
  reservationId: null,
}, state));

export default handleActions({
  [SET_SELECTED_AVAILABILITY](state, action) {
    return state.set('selectedAvailability', action.payload);
  },

  [SET_AVAILABILITIES](state, action) {
    return state.set('availabilities', action.payload);
  },

  [SET_IS_FETCHING](state, action) {
    return state.set('isFetching', action.payload);
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
    const registrationStep = action.payload;
    console.log('reducers');
    return state.merge({
      registrationStep,
    });
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
