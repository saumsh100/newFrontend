
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

/**
 * Actions
 */
export const setTableData = createAction(SET_TABLE_DATA);
export const setIsLoading = createAction(SET_IS_LOADING_TABLE);
export const setSmartFilter = createAction(SET_SMART_FILTER);
export const setFilters = createAction(SET_TABLE_FILTERS);
export const removeFilter = createAction(REMOVE_TABLE_FILTER);
export const clearFilters = createAction(CLEAR_TABLE_FILTERS);

/**
 * Initial State
 */
export const createInitialPatientState = state => {
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

}, initialState);
