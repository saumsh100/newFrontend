
import { createAction } from 'redux-actions';
import {
  FETCH_REPUTATION,
  FETCH_REPUTATION_SUCCESS,
  SET_FILTERS_LOADED,
  SET_REPUTATION_FILTER,
} from '../constants';

export const fetchReputationStart = createAction(FETCH_REPUTATION);
export const fetchReputationSuccess = createAction(FETCH_REPUTATION_SUCCESS);
export const setReputationFilter = createAction(SET_REPUTATION_FILTER);
export const setFiltersLoaded = createAction(SET_FILTERS_LOADED);
