
import { fromJS, Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

/**
 * Constants
 */
export const SET_TABLE_DATA = 'SET_ACCOUNT';
export const SET_IS_LOADING_TABLE = 'SET_IS_LOADING_TABLE';
export const SET_SMART_FILTER = 'SET_SMART_FIlTER';
export const SET_TABLE_FILTERS = 'SET_TABLE_FILTERS';
export const REMOVE_TABLE_FILTER = 'REMOVE_TABLE_FILTER';
export const CLEAR_TABLE_FILTERS = 'CLEAR_TABLE_FILTERS';
export const CLEAR_TABLE_SEARCH = 'CLEAR_TABLE_SEARCH';
export const ADD_REMOVE_TIMELINE_FILTERS = 'ADD_REMOVE_TIMELINE_FILTERS';
export const SELECT_ALL_TIMELINE_FILTERS = 'SELECT_ALL_TIMELINE_FILTERS';
export const CLEAR_ALL_TIMELINE_FILTERS = 'CLEAR_ALL_TIMELINE_FILTERS';

/**
 * Actions
 */
export const setTableData = createAction(SET_TABLE_DATA);
export const setIsLoading = createAction(SET_IS_LOADING_TABLE);
export const setSmartFilter = createAction(SET_SMART_FILTER);
export const setFilters = createAction(SET_TABLE_FILTERS);
export const removeFilter = createAction(REMOVE_TABLE_FILTER);
export const clearFilters = createAction(CLEAR_TABLE_FILTERS);
export const clearSearch = createAction(CLEAR_TABLE_SEARCH);

export const addRemoveTimelineFilters = createAction(ADD_REMOVE_TIMELINE_FILTERS);
export const selectAllTimelineFilters = createAction(SELECT_ALL_TIMELINE_FILTERS);
export const clearAllTimelineFilters = createAction(CLEAR_ALL_TIMELINE_FILTERS);

/**
 * Initial State
 */
export const createInitialPatientState = (state) => {
  return fromJS(Object.assign({
    data: [],
    totalPatients: 0,
    isLoadingTable: false,
    limit: 15,
    page: 0,
    sort: [],
    filters: Map(),
    filterTags: Map(),
    smartFilter: null,
    searchFirstName: '',
    searchLastName: '',

    timelineFilters: ['appointment', 'reminder', 'review', 'call', 'new patient'],
  }, state));
};

export const initialState = createInitialPatientState();

/**
 * Reducer
 */
export default handleActions({
  [SET_TABLE_DATA](state, { payload }) {
    return state.merge(payload);
  },

  [SET_IS_LOADING_TABLE](state, { payload }) {
    return state.set('isLoadingTable', payload);
  },

  [SET_TABLE_FILTERS](state, { payload }) {
    const filters = state.get('filters');
    const newFilters = filters.set(`${payload.filter.indexFunc}`, payload.filter);
    return state.merge({
      filters: newFilters,
      page: 0,
    });
  },

  [REMOVE_TABLE_FILTER](state, { payload }) {
    const filters = state.get('filters');
    const size = filters.size;

    if (size) {
      const modifiedFilters = filters.delete(`${payload.index}`);
      return state.set('filters', modifiedFilters);
    }
    return state;
  },

  [SET_SMART_FILTER](state, { payload }) {
    const index = payload.smFilter.index;

    if (index !== -1) {
      return state.merge({
        smartFilter: payload.smFilter,
        page: 0,
      });
    }
    return initialState;
  },

  [CLEAR_TABLE_FILTERS](state) {
    const filters = state.get('filters').clear();
    return state.set('filters', filters);
  },

  [CLEAR_TABLE_SEARCH](state) {
    state.set('searchFirstName', '');
    state.set('searchLastName', '');
    return state;
  },

  [ADD_REMOVE_TIMELINE_FILTERS](state, { payload }) {
    let filters = state.get('timelineFilters');

    if (filters.size > 0) {
      filters = filters.toJS();
    }
    const type = payload.type;

    if (filters.indexOf(type) > -1) {
      const index = filters.indexOf(type);
      const newFilters = filters;
      newFilters.splice(index, 1);
      return state.merge({
        timelineFilters: newFilters,
      });
    }

    const newFilters = filters;
    newFilters.push(type);
    return state.merge({
      timelineFilters: newFilters,
    });
  },

  [CLEAR_ALL_TIMELINE_FILTERS](state) {
    return state.set('timelineFilters', []);
  },

  [SELECT_ALL_TIMELINE_FILTERS](state) {
    const defaultEvents = initialState.get('timelineFilters');
    return state.set('timelineFilters', defaultEvents);
  },
}, initialState);
