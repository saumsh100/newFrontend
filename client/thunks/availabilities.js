import axios from './axios';
import {
	sixDaysShiftAction,
	setDayAction,
	setPractitionerAction,
	setServiceAction,
	createPatientAction,
	setStartingAppointmentTimeAction,
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

    startTime,
    endTime,
    patientId,
    serviceId,
    practitionerId,

	} = params;
	return function (dispatch, getState) {
		const patientParams = { firstName, lastName, email, phone }
    axios.post('api/patients', patientParams)
      .then(() => {
        dispatch(createPatientAction(params));
        const saveParams = { 
        	isConfirmed: false,
    			isCancelled: false,
			    startTime,
			    endTime,
			    patientId,
			    serviceId,
			    practitionerId,
        }
        saveRequest(saveParams);
      })
      .catch(err => console.log(err));
	}	
}

export function setStartingAppointmentTime(startsAt) {
	return function (dispatch, getState) {
		dispatch(setStartingAppointmentTimeAction(startsAt));
	}	
}

export function saveRequest(params) {
	return function (dispatch, getState) {
    axios.post('api/requests', params)
      .then(() => {
				dispatch(saveRequestAction(params));
      })
      .catch(err => console.log(err));
	}
}
