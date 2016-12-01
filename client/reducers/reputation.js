
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  FETCH_REPUTATION,
  FETCH_REPUTATION_SUCCESS,
} from '../constants';

const initialState = fromJS({
  status: 'loading', // set only to 'loading', 'success' or 'error'
  lastFetched: null,
  data: {
    sourcesNotFound: null,
    sourcesFound: null,
    listingScore: null,
    listingPointScore: {
      industryAverage: null,
      industryLeadersAverage: null,
      pointScore: null,
    },
    
    citationsFound: null,
    sourcesFoundWithErrors: null,
    accuracyScore: null,
  },
});

export default handleActions({
  [FETCH_REPUTATION](state, action) {
    return state.set('status', 'loading');
  },
  
  [FETCH_REPUTATION_SUCCESS](state, action) {
    const { data } = action.payload;
    
    // TODO: remove chaining, use 'merge'
    return state
      .set('status', 'success')
      .set('lastFetched', (new Date()).toLocaleString())
      .set('data', data);
  },
}, initialState);
