
import { handleActions, createAction } from 'redux-actions';
import { Map } from 'immutable';
import {
  SET_IS_COLLAPSED,
} from '../constants';


export const SET_IS_SEARCH_COLLAPSED = 'SET_IS_SEARCH_COLLAPSED';

/**
 * Actions
 */
export const setIsSearchCollapsed = createAction(SET_IS_SEARCH_COLLAPSED);

export const initialState = Map({
  isCollapsed: true,
  isSearchCollapsed: true,
});

export default handleActions({
  [SET_IS_COLLAPSED](state, { payload: isCollapsed }) {
    return state.set('isCollapsed', isCollapsed);
  },
  [SET_IS_SEARCH_COLLAPSED](state, action) {
    return state.set('isSearchCollapsed', action.payload.isCollapsed);
  },
}, initialState);
