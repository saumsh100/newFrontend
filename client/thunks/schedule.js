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

export function setAllFilters(entityKeys) {
  return function (dispatch, getState) {
    const { entities } = getState();

    const filterFromEntity = {
      appointments: 'isPatientConfirmed',
    };

    entityKeys.map((key) => {
      const model = entities.getIn([key, 'models']);
      const filterItem = filterFromEntity[key];

      if (filterItem) {
        const filterModel = model.toArray().filter((m) => m.get(filterItem));
        dispatch(addAllScheduleFilter({ key: `${key}Filter`, entities: filterModel }));
      } else {
        dispatch(addAllScheduleFilter({ key: `${key}Filter`, entities: model }));
      }
    });
  };
}
