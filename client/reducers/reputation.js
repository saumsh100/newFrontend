
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_REPUTATION_FILTER,
  SET_FILTERS_LOADED,
} from '../constants';

const initialState = fromJS({
  reviewsfiltersloaded: false,
  reviewsFilter: fromJS({
    sources: null,
    dateRange: null,
    ratings: null,
  }),
});

export default handleActions({
  [SET_REPUTATION_FILTER](state,action) {
    const key = action.payload.key;
    const mergeObj = {};
    mergeObj[key] = action.payload.filterData;
    return state.merge(mergeObj);
  },
  [SET_FILTERS_LOADED](state,action) {
    return state.merge({
      reviewsFilterloaded: action.payload.data,
    });
  },
}, initialState);
