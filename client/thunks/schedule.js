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
    const { entities } = getState();

    const entityKeys = [
      { key: 'services', fkey: 'servicesFilter' },
      { key: 'chairs', fkey: 'chairsFilter' },
    ];

    entityKeys.map((entity) => {
      const model = entities.getIn([entity.key, 'models']);
      dispatch(addAllScheduleFilter({ key: entity.fkey, entities: model }));
    });
  };
}
