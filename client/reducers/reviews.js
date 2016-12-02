
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
      
    }),
});

export default handleActions({
  [FETCH_REVIEWS](state, action) {
    return state.set('status', 'loading');
  },
  
  [FETCH_REVIEWS_SUCCESS](state, action) {
    const { data } = action.payload;
    
    return state.merge({
      status: 'success',
      lastFetched: (new Date()).toLocaleString(),
      data: data
    })
  },
}, initialState);
