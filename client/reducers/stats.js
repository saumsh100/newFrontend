
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  APPOINTMENT_STATS,
} from '../constants';

const initialState = fromJS({
});

export default handleActions({
  [APPOINTMENT_STATS](state, action) {
    return state.set('appointmentStats', action.payload);
  },
}, initialState);
