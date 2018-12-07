
import { fromJS, Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

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
  CREATE_NEW_PATIENT,
} from '../constants';

const reducer = '@schedule/';

const SET_AVAILABILITIES = `${reducer}SET_AVAILABILITIES`;
const SET_AVAILABILITIES_ERROR = `${reducer}SET_AVAILABILITIES_ERROR`;

export const setAvailabilities = createAction(SET_AVAILABILITIES);
export const setAvailabilitiesError = createAction(SET_AVAILABILITIES_ERROR);

const initialState = fromJS({
  scheduleDate: new Date(),
  scheduleView: 'chair',

  appointmentMinUnit: 15,
  timeSlotHeight: 75,
  columnWidth: 150,
  leftColumnWidth: 70,

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
  createNewPatient: false,
  availabilities: {},
  error: null,
});

export default handleActions(
  {
    [SET_MERGING](state, action) {
      return state.set('mergingPatientData', action.payload);
    },

    [SET_SCHEDULE_DATE](state, action) {
      return state.merge({ scheduleDate: action.payload.scheduleDate });
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

    [CREATE_NEW_PATIENT](state, action) {
      const createPatientBool = action.payload.createPatientBool;
      return state.set('createNewPatient', createPatientBool);
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

      entities.forEach((entity) => {
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

    [SET_SYNCING](state, action) {
      return state.set('syncingWithPMS', action.payload.isSyncing);
    },

    [SET_AVAILABILITIES](state, { payload }) {
      return state.merge({
        availabilities: payload,
        error: null,
      });
    },

    [SET_AVAILABILITIES_ERROR](state, { payload }) {
      return state.merge({
        availabilities: Map(),
        error: payload,
      });
    },
  },
  initialState,
);
