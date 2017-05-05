import {
  addPractitionerFilter,
  removePractitionerFilter,
  selectAppointmentTypeFilter,
  setSheduleModeAction,
  addAllScheduleFilter,
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

export function setSheduleMode(mode) {
    return function (dispatch, getState) {
      dispatch(setSheduleModeAction({ mode }));
    };
}

export function setAllFilters() {
  return function (dispatch, getState) {

    const entityKeys = ['services', 'chairs'];
    const filterKeys = ['servicesFilter', 'chairsFilter']

    entityKeys.map((key) => {
      const { entities } = getState();
      const { schedule } = getState();
      const entity = entities.getIn([key, 'models']);
      filterKeys.map((fkey) => {
        dispatch(addAllScheduleFilter({ key: fkey, entities: entity }));
      });
    });
  };
}
