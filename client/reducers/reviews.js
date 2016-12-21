
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  FETCH_REVIEWS,
  FETCH_REVIEWS_SUCCESS,
} from '../constants';

const initialState = fromJS({
  // set only to 'loading', 'success' or 'error'
  status: 'loading',
  lastFetched: null,
  data: fromJS({
    industryAverageCount: null,
    sourceId: null,
    ratingCounts: null,
    industryAverageRating: null,
    totalCount: null,
    recentPhrases: null,
    sourceCounts: null,
  }),
});

export default handleActions({
  [FETCH_REVIEWS](state) {
    return state.set('status', 'loading');
  },

  [FETCH_REVIEWS_SUCCESS](state, action) {
    const { data } = action.payload;

    return state.merge({
      status: 'success',
      lastFetched: (new Date()).toLocaleString(),
      data,
    });
  },
}, initialState);
