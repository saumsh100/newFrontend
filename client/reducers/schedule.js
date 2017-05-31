
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import moment from 'moment';

import {
  CLEAR_SCHEDULE_FILTER,
  ADD_ALL_SCHEDULE_FILTER,
  ADD_SCHEDULE_FILTER,
  REMOVE_SCHEDULE_FILTER,
  SET_SCHEDULE_DATE,
  SELECT_APPOINTMENT,
} from '../constants';

const initialState = fromJS({
  scheduleDate: new Date(),
  chairsFilter: [],
  practitionersFilter: [],
  servicesFilter: [],
  remindersFilter: ['Reminder Sent', 'PMS Not Synced', 'Patient Confirmed'],
  selectedAppointment: null,
});

export default handleActions({
  [SET_SCHEDULE_DATE](state, action) {
    return state.merge({
      scheduleDate: action.payload.scheduleDate,
    });
  },

  [SELECT_APPOINTMENT](state, action) {
    const appointment = action.payload;
    return state.set('selectedAppointment', appointment);
  },

  [ADD_SCHEDULE_FILTER](state, action) {
    const key = action.payload.key;
    const filterEntities = state.toJS()[key];
    filterEntities.push(action.payload.id);
    const mergeObj = {};
    mergeObj[key] = filterEntities;
    return state.merge(mergeObj);
  },

  [REMOVE_SCHEDULE_FILTER](state, action) {
    const key = action.payload.key;
    const filterEntities = state.toJS()[key];
    const mergeObj = {};
    mergeObj[key] = filterEntities.filter(id => id !== action.payload.id);
    return state.merge(mergeObj);
  },

  [ADD_ALL_SCHEDULE_FILTER](state, action) {
    const key = action.payload.key;
    const entities = action.payload.entities;
    const filterEntities = state.toJS()[key];

    entities.map((entity) => {
      const checkFilter = filterEntities.indexOf(entity.get('id')) > -1;
      if (!checkFilter) {
        filterEntities.push(entity.get('id'));
      }
    });

    const mergeObj = {};
    mergeObj[key] = filterEntities;
    return state.merge(mergeObj);
  },

  [CLEAR_SCHEDULE_FILTER](state, action) {
    const key = action.payload.key;
    const temp = {};
    temp[key] = [];
    return state.merge(temp);
  },
}, initialState);
