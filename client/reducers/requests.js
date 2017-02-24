import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_HOVER_REQUEST_ID,
} from '../constants';

const initialState = fromJS({
  hoverRequestId: null,
});

export default handleActions({

  [SET_HOVER_REQUEST_ID](state, action){
    const newId = action.payload.id === state.toJS().clickedId ? null : action.payload.id;
    return state.merge({
      hoverRequestId: newId,
    });
  },

}, initialState);