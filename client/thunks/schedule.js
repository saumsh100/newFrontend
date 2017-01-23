import {
	addPractitionerFilter,
	removePractitionerFilter,
	selectAppointmentTypeFilter,
} from '../actions/schedule';

export function addPractitionerToFilter(id) {
  return function (dispatch, getState) {
    dispatch(addPractitionerFilter({ practitioner: id }));
  };
}

export function removePractitionerFromFilter(id) {
  return function (dispatch, getState) {
    dispatch(removePractitionerFilter({ practitioner: id }));
  };	
}

export function selectAppointmentType(type) {
	return function (dispatch, getState) {
    dispatch(selectAppointmentTypeFilter({ type }));
  };	 
}
