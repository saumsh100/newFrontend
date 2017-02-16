import {
	sixDaysShiftAction,
	setDayAction,
	setPractitionerAction,
	setServiceAction,
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
