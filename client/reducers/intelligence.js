import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  QUERY_DATES,
} from '../constants';

const initialState = fromJS({
  startDate: null,
  endDate: null,
});

export default handleActions({
  [QUERY_DATES](state, action) {
    state = state.set('endDate', action.payload.endDate);
    return state.set('startDate', action.payload.startDate);
  },
}, initialState);
