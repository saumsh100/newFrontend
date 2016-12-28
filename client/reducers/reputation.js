
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  FETCH_REPUTATION,
  FETCH_REPUTATION_SUCCESS,
} from '../constants';

const initialState = fromJS({
  // set only to 'loading', 'success' or 'error'
  status: 'loading',
  lastFetched: null,
  data: fromJS({
    sourcesNotFound: null,
    sourcesFound: null,
    listingScore: null,
    listingPointScore: fromJS({
      industryAverage: null,
      industryLeadersAverage: null,
      pointScore: null,
    }),

    citationsFound: null,
    sourcesFoundWithErrors: null,
    accuracyScore: null,
  }),
});

export default handleActions({
  [FETCH_REPUTATION](state) {
    return state.set('status', 'loading');
  },

  [FETCH_REPUTATION_SUCCESS](state, action) {
    const { data } = action.payload;
    return state.merge({
      status: 'success',
      lastFetched: (new Date()).toLocaleString(),
      data,
    });
  },
}, initialState);
