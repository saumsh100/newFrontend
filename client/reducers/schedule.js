import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

import {
  CLEAR_SCHEDULE_FILTER,
  ADD_ALL_SCHEDULE_FILTER,
  ADD_SCHEDULE_FILTER,
  REMOVE_SCHEDULE_FILTER,
  SET_SCHEDULE_DATE,
  SELECT_APPOINTMENT,
  REJECT_APPOINTMENT,
  SELECT_WAITSPOT,
  SET_SYNCING,
  SET_MERGING,
  SET_SCHEDULE_VIEW,
  CREATE_NEW_PATIENT,
  REJECT,
  SET_IS_SELECT_APPOINTMENT_DBCLICK,
  SET_NOTIFICATION,
  SET_IS_OPEN_WAITLIST,
} from '../constants';

const initialState = fromJS({
  scheduleDate: sessionStorage.getItem('scheduleDate') || new Date().toISOString(),
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
  rejectedAppointment: null,
  selectedWaitSpot: null,
  syncingWithPMS: false,
  mergingPatientData: {
    patientUser: null,
    requestData: null,
    suggestions: [],
  },
  createNewPatient: false,
  reject: false,
  isSelectedAppointmentDbClick: false,
  scheduleNotification: 0,
  isOpenWaitlist: false,
});

export default handleActions(
  {
    [SET_MERGING](state, action) {
      return state.set('mergingPatientData', action.payload);
    },

    [SET_SCHEDULE_DATE](state, action) {
      sessionStorage.setItem('scheduleDate', action.payload.scheduleDate);
      return state.merge({ scheduleDate: action.payload.scheduleDate });
    },

    [SET_SCHEDULE_VIEW](state, action) {
      return state.set('scheduleView', action.payload.view);
    },

    [SELECT_APPOINTMENT](state, action) {
      const appointment = action.payload;
      return state.set('selectedAppointment', appointment);
    },
    [SET_IS_SELECT_APPOINTMENT_DBCLICK](state, action) {
      return state.set('isSelectedAppointmentDbClick', action?.payload);
    },

    [SET_IS_OPEN_WAITLIST](state, action) {
      const { waitlistBool } = action.payload;
      return state.set('isOpenWaitlist', waitlistBool);
    },

    [REJECT_APPOINTMENT](state, action) {
      const rejected = action.payload;
      return state.set('rejectedAppointment', rejected);
    },

    [SELECT_WAITSPOT](state, action) {
      const waitSpot = action.payload;
      return state.set('selectedWaitSpot', waitSpot);
    },

    [CREATE_NEW_PATIENT](state, action) {
      const { createPatientBool } = action.payload;
      return state.set('createNewPatient', createPatientBool);
    },
    [REJECT](state, action) {
      const { rejectBool } = action.payload;
      return state.set('reject', rejectBool);
    },

    [ADD_SCHEDULE_FILTER](state, action) {
      const { key } = action.payload;
      const filterEntities = state.toJS()[key];
      filterEntities.push(action.payload.id);
      const mergeObj = {};
      mergeObj[key] = filterEntities;
      return state.merge(mergeObj);
    },

    [REMOVE_SCHEDULE_FILTER](state, action) {
      const { key } = action.payload;
      const filterEntities = state.toJS()[key];
      const mergeObj = {};
      mergeObj[key] = filterEntities.filter((id) => id !== action.payload.id);
      return state.merge(mergeObj);
    },

    [ADD_ALL_SCHEDULE_FILTER](state, action) {
      const { key } = action.payload;
      const { entities } = action.payload;
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
      const { key } = action.payload;
      const temp = {};
      temp[key] = [];
      return state.merge(temp);
    },

    [SET_SYNCING](state, action) {
      return state.set('syncingWithPMS', action.payload.isSyncing);
    },
    [SET_NOTIFICATION](state, action) {
      const notification = action.payload;
      return state.set('scheduleNotification', notification);
    },
  },
  initialState,
);
