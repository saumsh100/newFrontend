import axios from './axios';
import moment from 'moment';

import {
	sixDaysShiftAction,
	setDayAction,
	setPractitionerAction,
	setServiceAction,
	createPatientAction,
	setStartingAppointmentTimeAction,
  setRegistrationStepAction
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
	} = params;
	return function (dispatch, getState) {
		const patientParams = { firstName, lastName, email, phone };
    axios.post('api/patients', patientParams)
      .then((data) => {
      	const patientId = data.data.result;
      	const { firstName, lastName, serviceId, practitionerId, startsAt  } = params;
	    	const reqParams = { 
	    		firstName,
	    		lastName,
	    		serviceId,
	    		practitionerId,
	    		startTime: startsAt,
	    		patientId,
	    		isConfirmed: false,
					isCancelled: false,
	    	} 
	    	axios.post('api/requests', reqParams)
		      .then(() => {
						dispatch(saveRequestAction(params));
		      })
      		.catch(err => console.log(err));
        dispatch(createPatientAction(params));
      })
      .catch(err => console.log(err));
	}	
}

export function setStartingAppointmentTime(startsAt) {
	return function (dispatch, getState) {
		dispatch(setStartingAppointmentTimeAction(startsAt));
	}	
}

export function setRegistrationStep(registrationStep) {
  return function (dispatch, getState) {
			dispatch(setRegistrationStepAction(registrationStep));
  }
}