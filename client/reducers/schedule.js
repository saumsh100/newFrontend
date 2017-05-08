
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import moment from 'moment';

import {
  ADD_PRACTITIONER,
  REMOVE_PRACTITIONER,
  SELECT_APPOINMENT_TYPE,
  SET_SCHEDULE_MODE,
  CLEAR_SCHEDULE_FILTER,
  ADD_ALL_SCHEDULE_FILTER,
  ADD_SCHEDULE_FILTER,
  REMOVE_SCHEDULE_FILTER,
} from '../constants';

const initialState = fromJS({
  practitioners: [],
  appointmentsFilter: [],
  chairsFilter: [],
  practitionersFilter: [],
  servicesFilter: [],

  appointmentType: null,
  currentScheduleMode: 'day',
  scheduleModes: ['Day', 'Week', 'Month'],

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
    filterEntities.push(action.payload.id);
    const mergeObj = {};
    mergeObj[key] = filterEntities;
    return state.merge(mergeObj);
  },

  [REMOVE_SCHEDULE_FILTER](state, action) {
    const key = action.payload.key;
    const filterEntities= state.toJS()[key];
    const mergeObj = {};
    mergeObj[key] = filterEntities.filter(id => id !== action.payload.id);
    return state.merge(mergeObj);
  },

  [ADD_ALL_SCHEDULE_FILTER](state, action) {
    const key = action.payload.key;
    const entities = action.payload.entities;
    const filterEntities= state.toJS()[key];

    entities.map((entity) => {
      const checkFilter = filterEntities.indexOf(entity.get('id')) > -1;
      if(!checkFilter) {
        filterEntities.push(entity.get('id'));
      }
    });
    const mergeObj = {};
    mergeObj[key] = filterEntities;
    return state.merge(mergeObj);
  },

  [CLEAR_SCHEDULE_FILTER](state, action) {
    const key = action.payload.key;
    const temp={};
    temp[key] = [];
    return state.merge(temp);
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
