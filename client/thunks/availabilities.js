import { batchActions } from 'redux-batched-actions';
import {
  setIsFetching,
  setAvailabilities,
  setNextAvailability,
  sixDaysShiftAction,
  setIsSuccessfulBooking,
  setStartingAppointmentTimeAction,
  setSelectedStartDate,
  setRegistrationStepAction,
  setClinicInfoAction,
  setTemporaryReservationAction,
  removeReservationAction,
  refreshAvailabilitiesState,
  setPatientUser,
} from '../actions/availabilities';
import PatientUser from '../entities/models/PatientUser';
import { setIsRecall, setSelectedPractitionerId } from '../reducers/availabilities';
import { bookingWidgetHttpClient } from '../util/httpClient';
import { getUTCDate } from '../components/library/util/datetime';

export function sixDaysShift(dayObj) {
  return function (dispatch) {
    dispatch(sixDaysShiftAction(dayObj));
  };
}

export function confirmCode(values) {
  return function (dispatch, getState) {
    const state = getState();
    const patientUser = state.auth.get('patientUser');
    return bookingWidgetHttpClient()
      .post(`/auth/signup/${patientUser.get('id')}/confirm`, values)
      .then(({ data }) => {
        dispatch(setPatientUser(new PatientUser(data)));
      });
  };
}

export function resendPinCode() {
  return function (dispatch, getState) {
    const state = getState();
    const patientUser = state.auth.get('patientUser');
    return bookingWidgetHttpClient().post(`/auth/${patientUser.get('id')}/resend`);
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
      insuranceCarrier,
      insuranceMemberId,
      sentRecallId,
      notes,
      familyPatientUser,
      utmParams,
      referrerURL,
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
      insuranceCarrier: patientUser.insuranceCarrier || insuranceCarrier,
      insuranceMemberId: patientUser.insuranceMemberId || insuranceMemberId,
      insuranceGroupId: patientUser.insuranceGroupId,
      sentRecallId,
      utmSource: utmParams?.utm_source,
      utmCampaign: utmParams?.utm_campaign,
      utmMedium: utmParams?.utm_medium,
      documentReferrer: referrerURL,
    };

    if (selectedPractitionerId) {
      params = {
        ...params,
        practitionerId: selectedPractitionerId,
        suggestedPractitionerId: selectedPractitionerId,
      };
    }

    return bookingWidgetHttpClient()
      .post('/requests', params)
      .then(() => {
        dispatch(setIsSuccessfulBooking(true));
        window.iframeClient && window.iframeClient.sendEvent('completeBooking');
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
      selectedAvailability,
      selectedServiceId,
      selectedPractitionerId,
      familyPatientUser,
    } = state.availabilities.toJS();

    const params = {
      accountId: account.id,
      patientUserId: familyPatientUser,
      preferences: waitSpot.preferences,
      unavailableDays: waitSpot.unavailableDays,
      daysOfTheWeek: waitSpot.daysOfTheWeek,
      availableTimes: waitSpot.times,

      reasonId: selectedServiceId,
      practitionerId: selectedPractitionerId !== '' ? selectedPractitionerId : null,

      endDate: selectedAvailability && selectedAvailability.startDate,
    };

    return bookingWidgetHttpClient()
      .post('/waitSpots', params)
      .then(({ data: { entities: waitSpots } }) => {
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

export function startRecall() {
  return function (dispatch) {
    dispatch(setIsRecall(true));
    dispatch(setSelectedPractitionerId(''));
  };
}

export function setRegistrationStep(registrationStep, accountId) {
  return function (dispatch, getState) {
    if (parseInt(registrationStep, 10) === 2) {
      const { practitionerId, serviceId, startsAt } = getState().availabilities.toJS();
      bookingWidgetHttpClient()
        .post('/reservations', {
          practitionerId,
          serviceId,
          startsAt,
          accountId,
        })
        .then((reservation) => {
          dispatch(setTemporaryReservationAction(reservation.data.result));
        });
    }

    dispatch(setRegistrationStepAction(registrationStep));
  };
}

export function getClinicInfo(accountId) {
  return function (dispatch) {
    bookingWidgetHttpClient()
      .get(`/logo/${accountId}`)
      .then((data) => {
        const { logo, address, clinicName, bookingWidgetPrimaryColor } = data.data;
        dispatch(
          setClinicInfoAction({
            logo,
            address,
            clinicName,
            bookingWidgetPrimaryColor,
          }),
        );
      });
  };
}

export function removeReservation(reservationId) {
  return function (dispatch) {
    bookingWidgetHttpClient()
      .delete(`/reservations/${reservationId}`)
      .then(() => {
        dispatch(removeReservationAction());
      });
  };
}

export function closeBookingModal(path) {
  return () => {
    // clean up state for closing the Modal
    window.parent.postMessage('message', '*');
    const lastRoute = path !== 'review' && path !== 'review/complete' ? path : 'book';
    window.iframeClient && window.iframeClient.sendEvent('closeModal', lastRoute);
  };
}

let requestCount = 0; // The number of availability requests sent

export function fetchAvailabilities(date) {
  return (dispatch, getState) => {
    // Set the loading symbol
    dispatch(setIsFetching(true));
    requestCount += 1;
    // Make request with current selected options
    const { availabilities, entities } = getState();
    const account = entities.getIn(['accounts', 'models']).first();
    const startDate = date || availabilities.get('selectedStartDate');

    // TODO: it should be calculating till end of endDate
    const endDate = getUTCDate(startDate).add(5, 'days').toISOString();
    const params = {
      serviceId: availabilities.get('selectedServiceId'),
      practitionerId: availabilities.get('selectedPractitionerId'),
      startDate,
      endDate,
    };

    return bookingWidgetHttpClient()
      .get(`/accounts/${account.get('id')}/availabilities`, {
        params,
      })
      .then(({ data }) => {
        const actions = [
          setAvailabilities(data.availabilities),
          setNextAvailability(data.nextAvailability),
        ];

        if (date) {
          actions.push(setSelectedStartDate(date));
        }

        dispatch(batchActions(actions));
      })
      .then(
        (data) =>
          new Promise((resolve, reject) => {
            Promise.all([
              data,
              new Promise((interResolve) => {
                setTimeout(interResolve, 1000);
              }),
            ]).then(([result]) => {
              resolve(result);
            }, reject);
          }),
      )
      .then(() => {
        requestCount -= 1;
        if (!requestCount) {
          dispatch(setIsFetching(false));
        }
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
