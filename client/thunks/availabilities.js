import axios from './axios';
import {
	sixDaysShiftAction,
	setDayAction,
	setPractitionerAction,
	setServiceAction,
	createPatientAction,
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
		dispatch(setServiceAction({ serviceId }));
	}	
}

export function createPatient(params) {
	return function (dispatch, getState) {
    axios.post('api/patients', params)
      .then(() => {
        dispatch(createPatientAction(params));
      })
      .catch(err => console.log(err));
	}	
}

