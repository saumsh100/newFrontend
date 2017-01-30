
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import moment from 'moment';
import {
  SET_CURRENT_DIALOG,
  SEND_MESSAGE_ON_CLIENT,
  SET_DIALOGS_FILTER,
} from '../constants';

const initialState = fromJS({
  currentDialog: null,
  filters: {
  	username: null,
  }
});

export default handleActions({
  [SET_CURRENT_DIALOG](state, action) {
    return state.merge({
      currentDialog: action.payload.currentDialogId,
    });
  },

  [SET_DIALOGS_FILTER](state, action) {
    return state.merge({
      filters: {
      	username: action.payload.username,
      } ,
    });
  },


}, initialState);
