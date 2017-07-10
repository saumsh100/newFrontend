import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_HOVER_REQUEST_ID,
  SET_REQUEST_COUNT,
  SET_UNDO_REQUEST,
} from '../constants';

const initialState = fromJS({
  hoverRequestId: null,
  requestCount: 0,
  undoRequest: null,
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

  [SET_UNDO_REQUEST](state, action) {
    const undoRequest = action.payload.undoRequest;
    return state.merge({
      undoRequest,
    });
  },
}, initialState);
