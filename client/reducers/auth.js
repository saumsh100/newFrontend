
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_USERNAME,
  SET_PASSWORD,
} from '../constants';

const initialState = fromJS({
  // set only to 'loading', 'success' or 'error'
  status: 'success',
  username: '',
  password: '',
  user: fromJS({
    id: null,
    username: null,
    activeAccountId: null
  }),
  permissions: null,
  role: null,
  // isLoggedIn: false,
});

export default handleActions({
  [LOGIN](state) {
    return state.set('status', 'loading');
  },

  [LOGIN_SUCCESS](state, action) {
    return state.merge({
      status: 'success',
      user: action.payload.user,
      // isLoggedIn: true,
      password: '',
      permissions: action.payload.permissions,
      role: action.payload.role,
    });
  },

  [LOGOUT](state) {
    return state.merge({
      user: {
        id: null,
        username: null,
        activeAccountId: null,
      },
      
      permissions: null,
      role: null,
    });
  },

  [SET_USERNAME](state, action) {
    return state.set('username', action.payload);
  },

  [SET_PASSWORD](state, action) {
    return state.set('password', action.payload);
  },
}, initialState);
