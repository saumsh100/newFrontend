import { fromJS } from 'immutable';

import {
  FETCH_REPUTATION,
  FETCH_REPUTATION_SUCCESS
} from './constants';

const initialState = fromJS({
  status: 'loading', // set only to 'loading', 'success' or 'error'
  lastFetched: null,
  data: null
})

function reputationReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_REPUTATION:
      return state.set('status', 'loading')
    case FETCH_REPUTATION_SUCCESS:
      return state
        .set('status', 'success')
        .set('lastFetched', (new Date()).toLocaleString())
        .set('data', action.data)
    default:
      return state
  }
}

export default reputationReducer;