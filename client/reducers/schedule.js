
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  ADD_PRACTITIONER,
  REMOVE_PRACTITIONER,
  SELECT_APPOINMENT_TYPE,
} from '../constants';

const initialState = fromJS({
  practitioners: [],
  appointmentType: null,
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
  },
  [SELECT_APPOINMENT_TYPE](state, action) {
  	const type = action.payload.type === 'all' ? null : action.payload.type;
  	return state.merge({
  		appointmentType: type,
  	});
  }
}, initialState);
