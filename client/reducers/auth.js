
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  LOGIN,
  LOGIN_SUCCESS,
  SET_USERNAME,
  SET_PASSWORD,
} from '../constants';

const initialState = fromJS({
  // set only to 'loading', 'success' or 'error'
  status: 'success',
  username: 'test',
  password: 'test',
  user: fromJS({
    id: null,
    username: null,
  }),
  isLoggedIn: false,
});

export default handleActions({
  [LOGIN](state) {
    return state.set('status', 'loading');
  },

  [LOGIN_SUCCESS](state, action) {
    const { user } = action.payload;

    return state.merge({
      status: 'success',
      user,
      isLoggedIn: true,
    });
  },

  [SET_USERNAME](state, action) {
    return state.set('username', action.payload);
  },

  [SET_PASSWORD](state, action) {
    return state.set('password', action.payload);
  },
}, initialState);
