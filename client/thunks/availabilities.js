
import moment from 'moment';
import axios from './axios';
import {
  setIsFetching,
  setAvailabilities,
  sixDaysShiftAction,
  setPatientUser,
  setIsSuccessfulBooking,
  setStartingAppointmentTimeAction,
  setRegistrationStepAction,
  setClinicInfoAction,
  setTemporaryReservationAction,
  removeReservationAction,
  refreshAvailabilitiesState,
} from '../actions/availabilities';

export function sixDaysShift(dayObj) {
  return function (dispatch) {
    dispatch(sixDaysShiftAction(dayObj));
  };
}

export function createPatient(values) {
  return function (dispatch) {
    return axios.post('/patients', values)
      .then(({ data }) => {
        // TODO: dispatch function that successfully created patient, plug in, confirm code
        // TODO: then allow them to create the patient
        // dispatch(createPatientAction(params));
        const patients = data.entities.patients;
        const id = Object.keys(patients)[0];
        const patient = patients[id];

        // Set the patient in state so other thunks can know the patient user
        dispatch(setPatientUser(patient));
        return patient;
      });
  };
}

export function confirmCode(values) {
  return function (dispatch, getState) {
    const state = getState();
    const patientUser = state.availabilities.get('patientUser');
    return axios.post(`/patients/${patientUser.id}/confirm`, values);
  };
}

export function createRequest() {
  return function (dispatch, getState) {
    const state = getState();
    const {
      account,
      patientUser,
      selectedAvailability: { startDate, endDate },
      selectedPractitionerId,
      selectedServiceId,
    } = state.availabilities.toJS();

    let params = {
      accountId: account.id,
      patientId: patientUser.id,
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
      patientUser,
      waitSpot,
    } = state.availabilities.toJS();

    const params = {
      accountId: account.id,
      patientId: patientUser.id,
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
    const endDate = moment(startDate).add(5, 'days').toISOString();
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
