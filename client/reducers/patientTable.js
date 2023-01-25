import { fromJS, Map, List } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

const reducer = '@patient-table';

/**
 * Constants
 */
export const SET_IS_LOADING = `${reducer}/SET_IS_LOADING`;
export const SET_DATA = `${reducer}/SET_DATA`;
export const ADD_FILTER = `${reducer}/ADD_FILTER`;
export const REMOVE_FILTER = `${reducer}/REMOVE_FILTER`;
export const REMOVE_ALL_FILTERS = `${reducer}/REMOVE_ALL_FILTERS`;

export const ADD_REMOVE_TIMELINE_FILTERS = 'ADD_REMOVE_TIMELINE_FILTERS';
export const SELECT_ALL_TIMELINE_FILTERS = 'SELECT_ALL_TIMELINE_FILTERS';
export const CLEAR_ALL_TIMELINE_FILTERS = 'CLEAR_ALL_TIMELINE_FILTERS';

export const SET_SELECTED_NOTE = `${reducer}/SET_SELECTED_NOTE`;
export const SET_SELECTED_FOLLOW_UP = `${reducer}/SET_SELECTED_FOLLOW_UP`;
export const SET_SELECTED_RECALL = `${reducer}/SET_SELECTED_RECALL`;

export const SET_IS_NOTE_FORM_ACTIVE = `${reducer}/SET_IS_NOTE_FORM_ACTIVE`;
export const SET_IS_FOLLOW_UPS_FORM_ACTIVE = `${reducer}/SET_IS_FOLLOW_UPS_FORM_ACTIVE`;
export const SET_IS_RECALLS_FORM_ACTIVE = `${reducer}/SET_IS_RECALLS_FORM_ACTIVE`;

export const SET_ACTIVE_PATIENT = `${reducer}/SET_ACTIVE_PATIENT`;
export const SET_FILTER_ACTIVE_SEGMENT_LABEL = `${reducer}/SET_FILTER_ACTIVE_SEGMENT_LABEL`;
export const REMOVE_FOLLOWUP_FILTERS = `${reducer}/REMOVE_FOLLOWUP_FILTERS`;

export const REMOVE_LOG_RECALL_PATIENT = `${reducer}/REMOVE_LOG_RECALL_PATIENT`;

/**
 * Actions
 */
export const setTableData = createAction(SET_DATA);
export const setIsLoading = createAction(SET_IS_LOADING);
export const addFilter = createAction(ADD_FILTER);
export const removeFilter = createAction(REMOVE_FILTER);
export const removeAllFilters = createAction(REMOVE_ALL_FILTERS);
export const removeFollowUpFilters = createAction(REMOVE_FOLLOWUP_FILTERS);

export const addRemoveTimelineFilters = createAction(ADD_REMOVE_TIMELINE_FILTERS);
export const selectAllTimelineFilters = createAction(SELECT_ALL_TIMELINE_FILTERS);
export const clearAllTimelineFilters = createAction(CLEAR_ALL_TIMELINE_FILTERS);

export const setSelectedNote = createAction(SET_SELECTED_NOTE);
export const setSelectedFollowUp = createAction(SET_SELECTED_FOLLOW_UP);
export const setSelectedRecall = createAction(SET_SELECTED_RECALL);

export const setIsNoteFormActive = createAction(SET_IS_NOTE_FORM_ACTIVE);
export const setIsFollowUpsFormActive = createAction(SET_IS_FOLLOW_UPS_FORM_ACTIVE);
export const setIsRecallsFormActive = createAction(SET_IS_RECALLS_FORM_ACTIVE);

export const setActivePatient = createAction(SET_ACTIVE_PATIENT);
export const setFilterActiveSegmentLabel = createAction(SET_FILTER_ACTIVE_SEGMENT_LABEL);

export const removeLogRecallPatient = createAction(REMOVE_LOG_RECALL_PATIENT);
/**
 * Initial State
 */
export const createInitialPatientState = (state) =>
  fromJS({
    data: List(),
    filters: Map({
      limit: 15,
      page: 0,
      order: [['firstName', 'asc']],
      segment: null,
      status: 'Active',
    }),

    isLoadingTable: false,
    count: 0,
    timelineFilters: [
      'appointment',
      'dueDate',
      'call',
      'review',
      'newPatient',
      'request',
      'recall',
      'reminder',
      'note',
      'followUp',
    ],

    selectedNote: null,
    selectedFollowUp: null,
    selectedRecall: null,

    isNoteFormActive: false,
    isFollowUpsFormActive: false,
    isRecallsFormActive: false,

    activePatient: null,
    filterActiveSegmentLabel: null,
    patientLogged: null,
    ...state,
  });

export const initialState = createInitialPatientState();

/**
 * Reducer
 */
export default handleActions(
  {
    [SET_DATA](state, { payload: { data, count } }) {
      return state.merge({
        data,
        count,
      });
    },

    [SET_IS_LOADING](state, { payload }) {
      return state.set('isLoadingTable', payload);
    },

    [ADD_FILTER](state, { payload }) {
      return state.mergeIn(['filters'], payload);
    },

    [REMOVE_FILTER](state, { payload }) {
      return state.deleteIn(['filters', payload]);
    },
    [REMOVE_ALL_FILTERS]() {
      return initialState;
    },
    [REMOVE_FOLLOWUP_FILTERS](state) {
      const filters = state.get('filters');
      return filters;
    },

    [ADD_REMOVE_TIMELINE_FILTERS](state, { payload }) {
      const filters = state.get('timelineFilters');
      const index = filters.findIndex((ev) => ev === payload.type);
      return state.set(
        'timelineFilters',
        index === -1 ? filters.push(payload.type) : filters.delete(index),
      );
    },

    [CLEAR_ALL_TIMELINE_FILTERS](state) {
      return state.set('timelineFilters', List());
    },

    [SELECT_ALL_TIMELINE_FILTERS](state) {
      const defaultEvents = initialState.get('timelineFilters');
      return state.set('timelineFilters', defaultEvents);
    },

    [SET_SELECTED_NOTE](state, { payload }) {
      return state.set('selectedNote', payload);
    },

    [SET_SELECTED_FOLLOW_UP](state, { payload }) {
      return state.set('selectedFollowUp', payload);
    },

    [SET_SELECTED_RECALL](state, { payload }) {
      return state.set('selectedRecall', payload);
    },

    [SET_IS_NOTE_FORM_ACTIVE](state, { payload }) {
      return state.set('isNoteFormActive', payload);
    },

    [SET_IS_FOLLOW_UPS_FORM_ACTIVE](state, { payload }) {
      return state.set('isFollowUpsFormActive', payload);
    },

    [SET_IS_RECALLS_FORM_ACTIVE](state, { payload }) {
      return state.set('isRecallsFormActive', payload);
    },

    [SET_ACTIVE_PATIENT](state, { payload }) {
      return state.set('activePatient', payload);
    },
    [SET_FILTER_ACTIVE_SEGMENT_LABEL](state, { payload }) {
      return state.set('filterActiveSegmentLabel', payload);
    },
    [REMOVE_LOG_RECALL_PATIENT](state, { payload }) {
      const currentState = state?.toJS();
      const activeSegment = currentState?.filters?.segment[0];
      const hasSentRecallFilterApplied = currentState?.filters?.sentRecalls;

      if (activeSegment === 'smartRecare' || hasSentRecallFilterApplied) {
        const patientList = currentState?.data || [];
        let count = currentState?.count;
        let filteredLoggedPatientList = patientList.filter(
          (patient) => patient.id !== payload.patientId,
        );

        if (patientList.length !== filteredLoggedPatientList.length) {
          const patientIndex = patientList.findIndex((patient) => patient.id === payload.patientId);
          filteredLoggedPatientList = filteredLoggedPatientList.map((patient, index) => {
            if (index >= patientIndex) {
              return {
                ...patient,
                rowNumber: patient.rowNumber - 1,
              };
            }
            return patient;
          });
          count = currentState?.count - (patientList.length - filteredLoggedPatientList.length);
        }

        return state.merge({
          data: filteredLoggedPatientList,
          count,
          patientLogged: payload.patientId,
        });
      }
      return state;
    },
  },

  initialState,
);
