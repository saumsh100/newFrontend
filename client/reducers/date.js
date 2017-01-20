
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import moment from 'moment'
import {
  SET_SCHEDULE_DATE
} from '../constants';

const initialState = fromJS({
  scheduleDate: moment(),
});

export default handleActions({
  [SET_SCHEDULE_DATE](state, action) {
    return state.merge({
      scheduleDate: action.scheduleDate,
    });
  }
}, initialState);
