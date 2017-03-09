import axios from './axios';
import {
	sixDaysShiftAction,
	setDayAction,
	setPractitionerAction,
	setServiceAction,
	createPatientAction,
	setStartingAppointmentTimeAction,
  setRegistrationStepAction,
  setClinicInfoAction,
  setTemporaryReservationAction,
  removeReservationAction,
} from '../actions/availabilities';

export function sixDaysShift(dayObj) {
  return function (dispatch, getState) {
    dispatch(sixDaysShiftAction(dayObj));
  };
}

export function setDay() {
	return function (dispatch, getState) {
		dispatch(setDayAction({ }));
	}
}

export function setPractitioner(practitionerId) {
	return function (dispatch, getState) {
		dispatch(setPractitionerAction(practitionerId));
	}	
}

export function setService(serviceId) {
	return function (dispatch, getState) {
		dispatch(setServiceAction(serviceId));
	}	
}

export function createPatient(params) {
	const {
		firstName,
		lastName,
		email,
		phone,

    startsAt,
    patientId,
    serviceId,
    practitionerId,
    domen,
    accountId,
	} = params;
	return function (dispatch, getState) {
		const patientParams = { firstName, lastName, email, phone, accountId }
    const url = domen ? '/patients' : 'api/patients'; 
    axios.post(url, patientParams)
      .then((result) => {
        dispatch(createPatientAction(params));
        const saveParams = { 
        	isConfirmed: false,
    			isCancelled: false,
			    startTime: startsAt,
			    patientId: result.data.result,
			    serviceId,
			    practitionerId,
			    domen,
			    accountId,
        }
				const requestUrl = domen ? '/requests' : 'api/requests'; 
		    axios.post(requestUrl, saveParams)
		      .then(() => {
						dispatch(saveRequestAction(params));
		      })
		      .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
	}	
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
  }
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