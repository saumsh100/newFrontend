
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  ADD_PRACTITIONER,
  REMOVE_PRACTITIONER,

} from '../constants';

const initialState = fromJS({
  practitioners: [],
});

export default handleActions({
  [ADD_PRACTITIONER](state, action) {
  	const practitioners = state.toJS().practitioners;
  	practitioners.push(action.payload.practitioner);
    return state.merge({
      practitioners,
    });
  },
  [REMOVE_PRACTITIONER](state, action) {
  	const practitioners = state.toJS().practitioners;
    return state.merge({
      practitioners: practitioners.filter(el => el !== action.payload.practitioner),
    });
  }
}, initialState);
