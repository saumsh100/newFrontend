import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_SERVICE_ID,
} from '../constants';

const initialState = fromJS({
  serviceId: null,
})

export default handleActions({
  [SET_SERVICE_ID](state, action){
    const newId = action.payload.id;
    return state.merge({
      serviceId: newId,
    });
  },
}, initialState);