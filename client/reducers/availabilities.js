import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SIX_DAYS_SHIFT,
  SET_DAY,
} from '../constants';

const initialState = fromJS({

});

export default handleActions({
  [SIX_DAYS_SHIFT](state, action) {
    const { selectedStartDay, selectedEndDay, practitionerId } = action.payload;
    return state.merge({
      [practitionerId]: { selectedEndDay, selectedStartDay }
    });
  },

  [SET_DAY](state, action) {
    return state.merge({

    });
  }
}, initialState);
