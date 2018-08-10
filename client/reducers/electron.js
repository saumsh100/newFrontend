
import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

export const EXPAND_CONTENT = '@electron/CONTENT_SHOW';
export const HIDE_CONTENT = '@electron/CONTENT_HIDE';
export const SET_POSITION = '@electron/SET_POSITION';
export const SET_TITLE = '@electron/SET_TITLE';
export const SET_BACK_HANDLER = '@electron/SET_BACK_HANDLER';

export const expandContent = createAction(EXPAND_CONTENT);
export const hideContent = createAction(HIDE_CONTENT);
export const setToolbarPosition = createAction(SET_POSITION);
export const setTitle = createAction(SET_TITLE);
export const setBackHandler = createAction(SET_BACK_HANDLER);

export const initialState = Map({
  showContent: false,
  toolbarPosition: null, // enum ['left', 'right']
  title: null,
  backHandler: null,
});

export default handleActions(
  {
    [EXPAND_CONTENT](state) {
      return state.set('showContent', true);
    },

    [HIDE_CONTENT](state) {
      return state.set('showContent', false);
    },

    [SET_POSITION](state, { payload }) {
      return state.merge({
        toolbarPosition: payload,
        showContent: false,
      });
    },

    [SET_TITLE](state, { payload }) {
      return state.set('title', payload);
    },

    [SET_BACK_HANDLER](state, { payload }) {
      return state.set('backHandler', payload);
    },
  },
  initialState,
);
