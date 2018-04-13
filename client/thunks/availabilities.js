
import moment from 'moment';
import axios from 'axios';
import { batchActions } from 'redux-batched-actions';
import {
  setIsFetching,
  setAvailabilities,
  setNextAvailability,
  sixDaysShiftAction,
  setIsSuccessfulBooking,
  setStartingAppointmentTimeAction,
  setRegistrationStepAction,
  setClinicInfoAction,
  setTemporaryReservationAction,
  removeReservationAction,
  refreshAvailabilitiesState,
  setPatientUser,
} from '../actions/availabilities';
import PatientUser from '../entities/models/PatientUser';

export function sixDaysShift(dayObj) {
  return function (dispatch) {
    dispatch(sixDaysShiftAction(dayObj));
  };
}

export function confirmCode(values) {
  return function (dispatch, getState) {
    const state = getState();
    const patientUser = state.auth.get('patientUser');
    return axios.post(`/auth/signup/${patientUser.get('id')}/confirm`, values).then(({ data }) => {
      dispatch(setPatientUser(new PatientUser(data)));
    });
  };
}

export function resendPinCode() {
  return function (dispatch, getState) {
    const state = getState();
    const patientUser = state.auth.get('patientUser');
    return axios.post(`/auth/${patientUser.get('id')}/resend`);
  };
}

export function createRequest() {
  return function (dispatch, getState) {
    const state = getState();
    const {
      account,
      selectedAvailability: { startDate, endDate, practitionerId, chairId },
      selectedPractitionerId,
      selectedServiceId,
      sentRecallId,
      notes,
      familyPatientUser,
      insuranceCarrier,
      insuranceMemberId,
    } = state.availabilities.toJS();

    const { patientUser } = state.auth.toJS();

    let params = {
      accountId: account.id,
      // This is the patient who will be seeing the dentist
      patientUserId: familyPatientUser,
      // This is the patient who requested the appointment
      requestingPatientUserId: patientUser.id,
      serviceId: selectedServiceId,
      startDate,
      endDate,
      suggestedPractitionerId: practitionerId,
      suggestedChairId: chairId,
      note: notes,
      insuranceCarrier,
      insuranceMemberId,
      sentRecallId,
    };

    if (selectedPractitionerId) {
      params = Object.assign({}, params, {
        practitionerId: selectedPractitionerId,
        suggestedPractitionerId: selectedPractitionerId,
      });
    }

    return axios
      .post('/requests', params)
      .then(() => {
        dispatch(setIsSuccessfulBooking(true));
      })
      .catch((err) => {
        console.log('FAILED REQUEST!');
        console.log(err);
      });
  };
}

export function createWaitSpot() {
  return function (dispatch, getState) {
    const state = getState();
    const { account, waitSpot, selectedAvailability } = state.availabilities.toJS();

    const { patientUser } = state.auth.toJS();

    const params = {
      accountId: account.id,
      patientUserId: patientUser.id,
      preferences: waitSpot.preferences,
      unavailableDays: waitSpot.unavailableDays,
      daysOfTheWeek: waitSpot.daysOfTheWeek,

      // If availability is selected, add this to the waitspot, so we can know when to remove
      endDate: selectedAvailability && selectedAvailability.startDate,
    };

    return axios.post('/waitSpots', params).then(({ data }) => {
      const waitSpots = data.entities.waitSpots;
      const id = Object.keys(waitSpots)[0];
      return waitSpots[id];
    });
  };
}

export function restartBookingProcess() {
  return function (dispatch) {
    // This is a thunk because we may need to do some other maintanence here...
    dispatch(refreshAvailabilitiesState());
  };
}

export function setStartingAppointmentTime(startsAt) {
  return function (dispatch) {
    dispatch(setStartingAppointmentTimeAction(startsAt));
  };
}

export function setRegistrationStep(registrationStep, accountId) {
  return function (dispatch, getState) {
    if (parseInt(registrationStep, 10) === 2) {
      const { practitionerId, serviceId, startsAt } = getState().availabilities.toJS();
      axios
        .post('/reservations', { practitionerId, serviceId, startsAt, accountId })
        .then((reservation) => {
          dispatch(setTemporaryReservationAction(reservation.data.result));
        });
    }

    dispatch(setRegistrationStepAction(registrationStep));
  };
}

export function getClinicInfo(accountId) {
  return function (dispatch) {
    axios.get(`/logo/${accountId}`).then((data) => {
      const { logo, address, clinicName, bookingWidgetPrimaryColor } = data.data;
      dispatch(setClinicInfoAction({ logo, address, clinicName, bookingWidgetPrimaryColor }));
    });
  };
}

export function removeReservation(reservationId) {
  return function (dispatch) {
    axios.delete(`/reservations/${reservationId}`).then(() => {
      dispatch(removeReservationAction());
    });
  };
}

export function closeBookingModal() {
  return () => {
    // clean up state for closing the Modal
    window.parent.postMessage('message', '*');
    window.iframeClient && window.iframeClient.sendEvent('closeModal');
  };
}

let requestCount = 0; // The number of availability requests sent

export function fetchAvailabilities() {
  return (dispatch, getState) => {
    // Set the loading symbol
    dispatch(setIsFetching(true));
    requestCount += 1;
    // Make request with current selected options
    const { availabilities, entities } = getState();
    const account = entities.getIn(['accounts', 'models']).first();
    const startDate = availabilities.get('selectedStartDate');

    // TODO: it should be calculating till end of endDate
    const endDate = moment(startDate)
      .add(5, 'days')
      .toISOString();
    const params = {
      serviceId: availabilities.get('selectedServiceId'),
      practitionerId: availabilities.get('selectedPractitionerId'),
      startDate,
      endDate,
    };

    return axios
      .get(`/accounts/${account.get('id')}/availabilities`, { params })
      .then(({ data }) => {
        const actions = [
          setAvailabilities(data.availabilities),
          setNextAvailability(data.nextAvailability),
        ];

        requestCount -= 1;
        // Remove loading symbol
        if (!requestCount) {
          actions.push(setIsFetching(false));
        }

        dispatch(batchActions(actions));
      })
      .catch((err) => {
        console.error('axios request error', err);
        const actions = [setAvailabilities([]), setNextAvailability(null)];

        requestCount -= 1;
        if (!requestCount) {
          actions.push(setIsFetching(false));
        }

        dispatch(batchActions(actions));
      });
  };
}
