
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { batchActions } from 'redux-batched-actions';

const reducer = '@widget-navigation';

export const initialState = fromJS({
  floatingButton: {
    isVisible: false,
    isDisabled: true,
    isClicked: false,
    text: 'Next',
  },
});

export const SET_IS_VISIBLE = `${reducer}/SET_IS_VISIBLE`;
export const SET_IS_DISABLED = `${reducer}/SET_IS_DISABLED`;
export const SET_IS_CLICKED = `${reducer}/SET_IS_CLICKED`;
export const SET_TEXT = `${reducer}/SET_TEXT`;

export const SHOW_BUTTON = `${reducer}/SHOW_BUTTON`;
export const HIDE_BUTTON = `${reducer}/HIDE_BUTTON`;

export const setIsVisible = createAction(SET_IS_VISIBLE);
export const setIsDisabled = createAction(SET_IS_DISABLED);
export const setIsClicked = createAction(SET_IS_CLICKED);
export const setText = createAction(SET_TEXT);

export const showButton = () => dispatch =>
  dispatch(batchActions([setIsVisible(true), setIsDisabled(false)], SHOW_BUTTON));
export const hideButton = () => dispatch =>
  dispatch(batchActions([setIsVisible(false), setIsDisabled(true)], HIDE_BUTTON));

export default handleActions(
  {
    [SET_IS_VISIBLE](state, { payload }) {
      return state.setIn(['floatingButton', 'isVisible'], payload);
    },
    [SET_IS_DISABLED](state, { payload }) {
      return state.setIn(['floatingButton', 'isDisabled'], payload);
    },
    [SET_IS_CLICKED](state, { payload }) {
      return state.setIn(['floatingButton', 'isClicked'], payload);
    },
    [SET_TEXT](state, { payload }) {
      return state.setIn(
        ['floatingButton', 'text'],
        payload || initialState.getIn(['floatingButton', 'text']),
      );
    },
  },
  initialState,
);
