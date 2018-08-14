
import { fromJS, Map } from 'immutable';
import moment from 'moment-timezone';
import { createAction, handleActions } from 'redux-actions';
import {
  SIX_DAYS_SHIFT,
  SET_START_DATE,
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
  SET_CONFIRM_AVAILABILITY,
  SET_IS_SUCCESSFUL_BOOKING,
  SET_HAS_WAITLIST,
  UPDATE_WAITSPOT,
  SET_IS_LOGIN,
  SET_NEXT_AVAILABILITY,
  SET_FORGOT_PASSWORD,
  SET_INSURANCE_MEMBER_ID,
  SET_INSURANCE_CARRIER,
  SET_SENTRECALLID,
  SET_DUE_DATE,
} from '../constants';

/**
 * In the future this will prefix @availabilities/
 * @type {string}
 */
const reducerName = '';
/**
 * CONSTANTS
 */
export const SET_NOTES = `${reducerName}SET_NOTES`;
export const RESET_WAITLIST = `${reducerName}RESET_WAITLIST`;
export const SET_PATIENT_USER = `${reducerName}SET_PATIENT_USER`;
export const SET_WAITLIST_DATES = `${reducerName}SET_WAITLIST_DATES`;
export const SET_WAITLIST_TIMES = `${reducerName}SET_WAITLIST_TIMES`;
export const SET_FAMILY_PATIENT_USER = `${reducerName}SET_FAMILY_PATIENT_USER`;
export const SET_SELECTED_SERVICE_ID = `${reducerName}SET_SELECTED_SERVICE_ID`;
export const REFRESH_FIRST_STEP_DATA = `${reducerName}REFRESH_FIRST_STEP_DATA`;
export const REFRESH_SECOND_STEP_DATA = `${reducerName}REFRESH_SECOND_STEP_DATA`;
export const SET_SELECTED_PRACTITIONER_ID = `${reducerName}SET_SELECTED_PRACTITIONER_ID`;
export const REFRESH_AVAILABILITIES_STATE = `${reducerName}REFRESH_AVAILABILITIES_STATE`;
export const SET_TIMEFRAME = `${reducerName}SET_TIMEFRAME`;
/**
 * ACTIONS
 */
export const setConfirmAvailability = createAction(SET_CONFIRM_AVAILABILITY);
export const setTimeFrame = createAction(SET_TIMEFRAME);
export const setSelectedAvailability = createAction(SET_SELECTED_AVAILABILITY);
export const setSelectedStartDate = createAction(SET_START_DATE);
export const setNotes = createAction(SET_NOTES);
export const resetWaitlist = createAction(RESET_WAITLIST);
export const setPatientUser = createAction(SET_PATIENT_USER);
export const setWaitlistDates = createAction(SET_WAITLIST_DATES);
export const setWaitlistTimes = createAction(SET_WAITLIST_TIMES);
export const refreshFirstStepData = createAction(REFRESH_FIRST_STEP_DATA);
export const setFamilyPatientUser = createAction(SET_FAMILY_PATIENT_USER);
export const setSelectedServiceId = createAction(SET_SELECTED_SERVICE_ID);
export const refreshSecondStepData = createAction(REFRESH_SECOND_STEP_DATA);
export const setSelectedPractitionerId = createAction(SET_SELECTED_PRACTITIONER_ID);
export const refreshAvailabilitiesState = createAction(REFRESH_AVAILABILITIES_STATE);

function getStartTimeForToday(account) {
  const timezone = account.timezone;
  const zone = -1 * moment.tz(new Date(), timezone).zone();
  return moment()
    .add(1, 'hours')
    .zone(zone)
    .toISOString();
}

function getFloorDate(date) {
  return moment(date)
    .startOf('day')
    .toISOString();
}

let selectedStartDate = moment()
  .add(1, 'hours')
  .toISOString();
export const createInitialWidgetState = (state) => {
  if (state) {
    selectedStartDate = getStartTimeForToday(state.account);
  }

  const floorDate = getFloorDate(selectedStartDate);

  // selectedStartDate = timezone ?
  return fromJS(Object.assign(
    {
      account: null,
      officeHours: null,
      practitioners: [],
      services: [],
      availabilities: [],
      nextAvailability: null,
      patientUser: null,
      isFetching: false,
      isBooking: true,
      familyPatientUser: null,
      insuranceCarrier: 'Pay for myself',
      insuranceMemberId: '',
      isConfirming: false,
      isLogin: false,
      forgotPassword: false,
      initialForm: {},
      isTimerExpired: false,
      isSuccessfulBooking: false,
      hasWaitList: false,
      waitlist: {
        dates: [],
        unavailableDates: [],
        times: [],
      },
      waitSpot: {
        preferences: {
          mornings: true,
          afternoons: true,
          evenings: true,
        },

        daysOfTheWeek: {
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
        },

        unavailableDays: [],
      },

      selectedAvailability: null,
      confirmedAvailability: false,
      selectedServiceId: null, // Will be set by the initialState from server
      selectedPractitionerId: '',
      selectedStartDate,
      registrationStep: 1,
      reservationId: null,
      notes: null,
      sentRecallId: null,
      dueDate: null,
      floorDate,
      timeframe: null,
    },
    state,
  ));
};

export default handleActions(
  {
    [REFRESH_AVAILABILITIES_STATE](state) {
      // We can't re-fetch practitioners and services cause they are pulled from server,
      // so don't purge those...
      // We also don't wanna re-set user-selected state because why make them re-select?
      return state.merge({
        isFetching: false,
        isLogin: false,
        isConfirming: false,
        isTimerExpired: false,
        isSuccessfulBooking: false,
        registrationStep: 1,
        reservationId: null,
        forgotPassword: false,
        selectedAvailability: null,
        isBooking: true,
        insuranceCarrier: 'Pay for myself',
        insuranceMemberId: '',
        familyPatientUser: null,
        selectedPractitionerId: '',
        selectedStartDate,
        notes: null,
        hasWaitList: false,
        waitlist: {
          dates: [],
          times: [],
        },
        waitSpot: {
          preferences: {
            mornings: true,
            afternoons: true,
            evenings: true,
          },

          daysOfTheWeek: {
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
          },

          unavailableDays: [],
        },

        sentRecallId: null,
      });
    },

    [SET_SELECTED_AVAILABILITY](state, action) {
      return state.set('selectedAvailability', action.payload);
    },

    [REFRESH_FIRST_STEP_DATA](state) {
      return state.merge({
        selectedAvailability: null,
        selectedServiceId: null,
        selectedPractitionerId: '',
        selectedStartDate: '',
        confirmedAvailability: false,
      });
    },
    [REFRESH_SECOND_STEP_DATA](state) {
      return state.merge({
        familyPatientUser: null,
        notes: null,
      });
    },

    [SET_AVAILABILITIES](state, action) {
      return state.set('availabilities', action.payload);
    },

    [SET_CONFIRM_AVAILABILITY](state, action) {
      return state.set('confirmedAvailability', action.payload);
    },

    [SET_NEXT_AVAILABILITY](state, action) {
      return state.set('nextAvailability', action.payload);
    },

    [SET_IS_FETCHING](state, action) {
      return state.set('isFetching', action.payload);
    },

    [SET_IS_CONFIRMING](state, action) {
      return state.set('isConfirming', action.payload);
    },

    [SET_IS_LOGIN](state, action) {
      return state.set('isLogin', action.payload);
    },

    [SET_FORGOT_PASSWORD](state, action) {
      return state.set('forgotPassword', action.payload);
    },

    [SET_TIMEFRAME](state, action) {
      return state.set('timeframe', action.payload);
    },

    [SET_IS_TIMER_EXPIRED](state, action) {
      const form = window.store.getState().form.userSignUpForm
        ? window.store.getState().form.userSignUpForm
        : {};
      const newState = form.values ? state.set('initialForm', form.values) : state;

      return newState.set('isTimerExpired', action.payload);
    },

    [SET_HAS_WAITLIST](state, action) {
      return state.set('hasWaitList', action.payload);
    },

    [UPDATE_WAITSPOT](state, action) {
      return state.mergeIn(['waitSpot'], action.payload);
    },

    [RESET_WAITLIST](state) {
      const payload = {
        dates: [],
        unavailableDates: [],
        times: [],
      };
      return state.set('waitlist', Map(payload));
    },
    [SET_WAITLIST_TIMES](state, action) {
      return state.setIn(['waitlist', 'times'], action.payload);
    },
    [SET_WAITLIST_DATES](state, action) {
      return state.setIn(['waitlist', 'dates'], action.payload);
    },
    [SET_PATIENT_USER](state, action) {
      return state.set('patientUser', action.payload);
    },

    [SET_IS_SUCCESSFUL_BOOKING](state, action) {
      return state.set('isSuccessfulBooking', action.payload);
    },

    [SET_NOTES](state, action) {
      return state.set('notes', action.payload);
    },

    [SET_INSURANCE_MEMBER_ID](state, action) {
      return state.set('insuranceMemberId', action.payload);
    },

    [SET_FAMILY_PATIENT_USER](state, action) {
      return state.set('familyPatientUser', action.payload);
    },

    [SET_INSURANCE_CARRIER](state, action) {
      return state.set('insuranceCarrier', action.payload);
    },

    [SIX_DAYS_SHIFT](state, action) {
      const {
        selectedStartDay,
        selectedEndDay,
        practitionerId,
        retrievedFirstTime,
      } = action.payload;
      return state.merge({
        [practitionerId]: {
          selectedEndDay,
          selectedStartDay,
          retrievedFirstTime,
        },
      });
    },

    [SET_SELECTED_SERVICE_ID](state, action) {
      return state.set('selectedServiceId', action.payload);
    },

    [SET_SELECTED_PRACTITIONER_ID](state, action) {
      return state.set('selectedPractitionerId', action.payload);
    },

    [SET_START_DATE](state, { payload }) {
      // If same day as today, set it to the 1 hour from now time
      // If not, set it to the beginning of the day
      const account = state.get('account').toJS();
      let startDate = getStartTimeForToday(account);
      if (!moment.tz(payload, account.timezone).isSame(startDate, 'day')) {
        startDate = moment
          .tz(payload, account.timezone)
          .hours(0)
          .minutes(0)
          .seconds(0)
          .milliseconds(0)
          .toISOString();
      }

      return state.set('selectedStartDate', startDate);
    },

    [CREATE_PATIENT](state, action) {
      const { firstName, lastName } = action.payload;
      return state.merge({
        messages: [`Patient ${firstName} ${lastName} has been registered`],
      });
    },

    [SET_REGISTRATION_STEP](state, action) {
      const form = window.store.getState().form.userSignUpForm
        ? window.store.getState().form.userSignUpForm
        : {};
      const newState = form.values ? state.set('initialForm', form.values) : state;

      return newState.set('registrationStep', action.payload);
    },

    [SET_CLINIC_INFO](state, action) {
      const {
        address, logo, clinicName, bookingWidgetPrimaryColor,
      } = action.payload;
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
      });
    },

    [REMOVE_RESERVATION](state) {
      return state.merge({
        reservationId: null,
        messages: ['Reserved time for this practitioner has been expired...'],
      });
    },

    [SET_SENTRECALLID](state, action) {
      console.log('action.payload', action.payload);
      return state.set('sentRecallId', action.payload);
    },

    [SET_DUE_DATE](state, { payload }) {
      let newState = state.set('dueDate', payload);
      if (moment().isBefore(payload)) {
        newState = newState.merge({
          selectedStartDate: payload,
          floorDate: getFloorDate(payload),
        });
      }

      return newState;
    },
  },
  createInitialWidgetState(),
);
