import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_HOVER_REQUEST_ID,
  SET_REQUEST_COUNT,
} from '../constants';

const initialState = fromJS({
  hoverRequestId: null,
  requestCount: 0,
});

export default handleActions({
  [SET_HOVER_REQUEST_ID](state, action){
    const newId = action.payload.id === state.toJS().hoverRequestId ? null : action.payload.id;
    return state.merge({
      hoverRequestId: newId,
    });
  },

  [SET_REQUEST_COUNT](state, action) {
    const requestCount = action.payload.count;
    return state.merge({
      requestCount,
    });
  },
}, initialState);
