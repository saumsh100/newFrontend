import {
  addAllScheduleFilter,
} from '../actions/schedule';

export function setAllFilters(entityKeys) {
  return function (dispatch, getState) {
    const { entities } = getState();
    entityKeys.map((key) => {
      const model = entities.getIn([key, 'models']);
      dispatch(addAllScheduleFilter({ key: `${key}Filter`, entities: model }));
    });
  };
}
