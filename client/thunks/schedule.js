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
      { key: 'appointments', filterKey: 'appointmentsFilter'},
      { key: 'chairs', filterKey: 'chairsFilter' },
      { key: 'practitioners', filterKey: 'practitionersFilter',  },
      { key: 'services', filterKey: 'servicesFilter'  },
    ];

    const filterFromEntity = {
      appointments: 'isPatientConfirmed',
    };

    entityKeys.map((entity) => {
      const model = entities.getIn([entity.key, 'models']);
      const filterItem = filterFromEntity[entity.key];

      if (filterItem) {
        const filterModel = model.toArray().filter((m) => m.get(filterItem));
        dispatch(addAllScheduleFilter({ key: entity.filterKey, entities: filterModel }));
      } else {
        dispatch(addAllScheduleFilter({key: entity.filterKey, entities: model}));
      }
    });
  };
}
