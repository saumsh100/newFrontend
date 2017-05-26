import {
  addAllScheduleFilter,
} from '../actions/schedule';

export function setAllFilters(entityKeys) {
  return function (dispatch, getState) {
    const { entities } = getState();

    entityKeys.map((key) => {
      const model = entities.getIn([key, 'models']);

      let filterModel = [];

      if(key === 'services') {
        const practitioners = entities.getIn(['practitioners', 'models']);
        practitioners.map((practitioner) => {
          const practitionerIds = practitioner.get('services');
          practitionerIds.map((serviceId) => {
            if(practitionerIds.indexOf(serviceId) > -1) {
              filterModel.push(model.get(serviceId));
            }
          });
        });
      } else {
        filterModel = model;
      }

      dispatch(addAllScheduleFilter({ key: `${key}Filter`, entities: filterModel }));
    });
  };
}
