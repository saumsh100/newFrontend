
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

import {
  CLEAR_SCHEDULE_FILTER,
  ADD_ALL_SCHEDULE_FILTER,
  ADD_SCHEDULE_FILTER,
  REMOVE_SCHEDULE_FILTER,
  SET_SCHEDULE_DATE,
  SELECT_APPOINTMENT,
  SELECT_WAITSPOT,
  SET_SYNCING,
  SET_MERGING,
  SET_SCHEDULE_VIEW,
} from '../constants';

const initialState = fromJS({
  scheduleDate: new Date(),
  scheduleView: 'chair',
  chairsFilter: [],
  practitionersFilter: [],
  servicesFilter: [],
  remindersFilter: ['Reminder Sent', 'PMS Not Synced', 'Patient Confirmed'],
  selectedAppointment: null,
  selectedWaitSpot: null,
  syncingWithPMS: false,
  mergingPatientData: {
    patientUser: null,
    requestData: null,
    suggestions: [],
  },
});

export default handleActions({
  [SET_MERGING](state, action) {
    return state.set('mergingPatientData', action.payload);
  },

  [SET_SCHEDULE_DATE](state, action) {
    return state.merge({
      scheduleDate: action.payload.scheduleDate,
    });
  },

  [SET_SCHEDULE_VIEW](state, action) {
    return state.set('scheduleView', action.payload.view);
  },

  [SELECT_APPOINTMENT](state, action) {
    const appointment = action.payload;
    return state.set('selectedAppointment', appointment);
  },

  [SELECT_WAITSPOT](state, action) {
    const waitSpot = action.payload;
    return state.set('selectedWaitSpot', waitSpot);
  },

  [ADD_SCHEDULE_FILTER](state, action) {
    const key = action.payload.key;
    const filterEntities = state.toJS()[key];

    if (key === 'practitionersFilter' && filterEntities.length === 4) {
      filterEntities.shift();
      filterEntities.push(action.payload.id);
    } else {
      filterEntities.push(action.payload.id);
    }

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

      if (key === 'practitionersFilter' && filterEntities.length < 4 && !checkFilter) {
        filterEntities.push(entity.get('id'));
      } else if (!checkFilter && key !== 'practitionersFilter') {
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

  [SET_SYNCING](state, action) {
    return state.set('syncingWithPMS', action.payload.isSyncing);
  },

}, initialState);
