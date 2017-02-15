import {
	sixDaysShiftAction,
	setDayAction,
} from '../actions/availabilities';

export function sixDaysShift(dayObj) {
	const { selectedStartDay, selectedEndDay, practitionerId } = dayObj;
  return function (dispatch, getState) {
    dispatch(sixDaysShiftAction({ selectedStartDay, selectedEndDay, practitionerId }));
  };
}

export function setDay() {
	return function (dispatch, getState) {
		dispatch(setDayAction({ }));
	}
}
