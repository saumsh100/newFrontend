
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import { SET_CURRENT_DIALOG, SET_DIALOG_SCROLL_PERMISSION } from '../constants';

const initialState = fromJS({
  currentDialog: null,
  filters: {
    username: null,
  },
  allowDialogScroll: true,
});

export default handleActions(
  {
    [SET_CURRENT_DIALOG](state, action) {
      return state.merge({
        currentDialog: action.payload.currentDialogId,
      });
    },
    [SET_DIALOG_SCROLL_PERMISSION](state, action) {
      return state.merge({
        allowDialogScroll: action.payload.allowDialogScroll.allowDialogScroll,
      });
    },
  },
  initialState,
);
