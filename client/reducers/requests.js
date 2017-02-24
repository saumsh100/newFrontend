import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_POPOVER_ID,
} from '../constants';

const initialState = fromJS({
  clickedId: null,
});

export default handleActions({

  [SET_POPOVER_ID](state, action){
    const newId = action.payload.id === state.toJS().clickedId ? null : action.payload.id;
    return state.merge({
      clickedId: newId,
    });
  },

}, initialState);