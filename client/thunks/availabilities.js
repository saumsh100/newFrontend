
import moment from 'moment';
import axios from 'axios';
import {
  setIsFetching,
  setAvailabilities,
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
    return axios.post(`/auth/signup/${patientUser.get('id')}/confirm`, values)
      .then(({ data }) => {
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
      selectedAvailability: { startDate, endDate },
      selectedPractitionerId,
      selectedServiceId,
    } = state.availabilities.toJS();

    const {
      patientUser,
    } = state.auth.toJS();

    let params = {
      accountId: account.id,
      patientUserId: patientUser.id,
      serviceId: selectedServiceId,
      startDate,
      endDate,
    };

    if (selectedPractitionerId) {
      params = Object.assign({}, params, { practitionerId: selectedPractitionerId });
    }

    return axios.post('/requests', params)
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
    const {
      account,
      waitSpot,
    } = state.availabilities.toJS();

    const {
      patientUser,
    } = state.auth.toJS();

    const params = {
      accountId: account.id,
      patientUserId: patientUser.id,
      preferences: waitSpot.preferences,
      unavailableDays: waitSpot.unavailableDays,
    };

    return axios.post('/waitSpots', params)
      .then(({ data }) => {
        const waitSpots = data.entities.waitSpots;
        const id = Object.keys(waitSpots)[0];
        return waitSpots[id];
      });
  };
}

export function restartBookingProcess() {
  return function (dispatch, getState) {
    // This is a thunk because we may need to do some other maintanence here...
    dispatch(refreshAvailabilitiesState());
  };
}

export function setStartingAppointmentTime(startsAt) {
  return function (dispatch, getState) {
    dispatch(setStartingAppointmentTimeAction(startsAt));
  }
}

export function setRegistrationStep(registrationStep, accountId) {
  return function (dispatch, getState) {
    if (registrationStep == 2) {
      const { practitionerId, serviceId, startsAt } = getState().availabilities.toJS();
      axios.post('/reservations', { practitionerId, serviceId, startsAt, accountId })
        .then((reservation) => {
          dispatch(setTemporaryReservationAction(reservation.data.result))
        })
    }

    dispatch(setRegistrationStepAction(registrationStep));
  };
}

export function getClinicInfo(accountId) {
  return function (dispatch, getState) {
    axios.get(`/logo/${accountId}`).then( (data => {
      const { logo, address, clinicName, bookingWidgetPrimaryColor } = data.data;
      dispatch(setClinicInfoAction({ logo, address, clinicName, bookingWidgetPrimaryColor }))
    }).bind(this) )
  }
}

export function removeReservation(reservationId) {
  return function(dispatch, getState) {
    axios.delete(`/reservations/${reservationId}`)
      .then(r => {
        dispatch(removeReservationAction());
      })
  }
}

export function closeBookingModal() {
  return (dispatch, getState) => {
    // clean up state for closing the Modal
    window.parent.postMessage('message', '*');
  };
}

export function fetchAvailabilities() {
  return (dispatch, getState) => {
    // Set the loading symbol
    dispatch(setIsFetching(true));

    // Make request with current selected options
    const { availabilities, entities } = getState();
    const account = entities.getIn(['accounts', 'models']).first();
    const startDate = availabilities.get('selectedStartDate');

    // TODO: it should be calculating till end of endDate
    const endDate = moment(startDate).add(4, 'days').toISOString();
    const params = {
      serviceId: availabilities.get('selectedServiceId'),
      practitionerId: availabilities.get('selectedPractitionerId'),
      startDate,
      endDate,
    };

    axios.get(`/accounts/${account.get('id')}/availabilities`, { params })
      .then(({ data }) => {
        dispatch(setAvailabilities(data.availabilities));

        // Remove loading symbol
        dispatch(setIsFetching(false));
      })
      .catch((err) => {
        dispatch(setAvailabilities([]));
        dispatch(setIsFetching(false));
        throw err;
      });
  };
}
