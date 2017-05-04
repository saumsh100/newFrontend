
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  ADD_PRACTITIONER,
  REMOVE_PRACTITIONER,
  SELECT_APPOINMENT_TYPE,
  SET_SCHEDULE_MODE,
  ADD_SERVICE_FILTER,
  REMOVE_SERVICE_FILTER,
  ADD_SCHEDULE_FILTER,
  REMOVE_SCHEDULE_FILTER
} from '../constants';

const initialState = fromJS({
  practitioners: [],
  servicesFilter: [],
  chairsFilter: [],
  appointmentType: null,
  currentScheduleMode: 'day',
  scheduleModes: ['Month', 'Week', 'Day'],
});

export default handleActions({
  [ADD_PRACTITIONER](state, action) {
    const practitioners = state.toJS().practitioners;
    practitioners.push(action.payload.practitioner);
    return state.merge({
      practitioners,
    });
  },
  [REMOVE_PRACTITIONER](state, action) {
    const practitioners = state.toJS().practitioners;
    return state.merge({
      practitioners: practitioners.filter(el => el !== action.payload.practitioner),
    });
  },
  [ADD_SCHEDULE_FILTER](state, action) {
    const key = action.payload.key;
    const filterEntities= state.toJS()[key];
    filterEntities.push(action.payload.entity);
    const mergeObj = {};
    mergeObj[key] = filterEntities;
    return state.merge(mergeObj);
  },
  [REMOVE_SCHEDULE_FILTER](state, action) {
    const key = action.payload.key;
    const filterEntities= state.toJS()[key];
    const mergeObj = {};
    mergeObj[key] = filterEntities.filter(entity => entity.id !== action.payload.id);
    return state.merge(mergeObj);
  },

  [SELECT_APPOINMENT_TYPE](state, action) {
    const type = action.payload.type === 'all' ? null : action.payload.type;
    return state.merge({
      appointmentType: type,
    });
  },

  [SET_SCHEDULE_MODE](state, action) {
    const { mode } = action.payload
    return state.merge({
      currentScheduleMode: state.toJS().scheduleModes[mode],
    });
  }

}, initialState);
