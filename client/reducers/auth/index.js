
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

export const LOGIN_SUCCESS = '@auth/LOGIN_SUCCESS';
export const LOGOUT = '@auth/LOGOUT';
export const ADAPTER_PERMISSIONS_SET = '@auth/ADAPTER_PERMISSIONS_SET';

export const loginSuccess = createAction(LOGIN_SUCCESS);
export const authLogout = createAction(LOGOUT);
export const adapterPermissionsSet = createAction(ADAPTER_PERMISSIONS_SET);

export const isAdapterPermissionEnabledSelector = (adapterPermissions, permissionName) =>
  adapterPermissions.get(permissionName) || false;

export const initialState = fromJS({
  isAuthenticated: false,
  forgotPassword: false,
  role: null,
  accountId: null,
  enterprise: null,
  user: null,
  sessionId: null,
  adapterPermissions: {},
  timezone: null,
  adapterType: null,
});

export default handleActions(
  {
    [ADAPTER_PERMISSIONS_SET](state, { payload }) {
      return state.merge({ adapterPermissions: payload });
    },

    [LOGIN_SUCCESS](state, { payload }) {
      return state.merge({
        ...payload,
        isAuthenticated: true,
      });
    },

    [LOGOUT]() {
      return initialState;
    },
  },
  initialState,
);
