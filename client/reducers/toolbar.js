
import { handleActions } from 'redux-actions';
import { Map } from 'immutable';
import {
  SET_IS_COLLAPSED,
} from '../constants';

export const initialState = Map({
  isCollapsed: window.innerWidth < 700,
});

export default handleActions({
  [SET_IS_COLLAPSED](state, { payload: isCollapsed }) {
    return state.set('isCollapsed', isCollapsed);
  },
}, initialState);
