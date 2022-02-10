import { fromJS } from 'immutable';
import reducer, {
  initialState,
  loginSuccess,
  authLogout,
  adapterPermissionsSet,
  isAdapterPermissionEnabledSelector,
} from './index';

describe('auth reducer', () => {
  const loginSuccessAction = loginSuccess({
    userId: '6603fe66-aa03-4ffe-8de6-ce07a4ae9c5c',
    role: 'SUPERADMIN',
    enterpriseId: 'f1405909-55cf-422a-9ec0-9f80de72b0bf',
    accountId: 'c05ade0e-eb8a-44ed-bf3c-a83bfa4bc5a3',
    enterprise: {
      id: 'f1405909-55cf-422a-9ec0-9f80de72b0bf',
      name: 'Gallery Dental Inc.',
      plan: 'ENTERPRISE',
      createdAt: '2018-04-11T17:19:13.773Z',
      updatedAt: '2018-04-11T17:19:13.773Z',
      deletedAt: null,
    },
    user: {
      id: '6603fe66-aa03-4ffe-8de6-ce07a4ae9c5c',
      firstName: 'Justin',
      lastName: 'Sharp',
      username: 'justin@carecru.com',
    },
    sessionId: 'd15fbddc-f306-49e1-b736-78cb6a6166d4',
  });

  const logoutAction = authLogout(undefined);

  const adapterPermissionsSetAction = adapterPermissionsSet({
    'can-add-patient': true,
    'can-update-appointment': false,
    'can-set-ismissing': true,
  });

  test('action creator works', () => {
    expect(loginSuccessAction).toMatchSnapshot();
    expect(logoutAction).toMatchSnapshot();
    expect(adapterPermissionsSetAction).toMatchSnapshot();
  });

  test('selectors works', () => {
    const adapterPermissions = fromJS(adapterPermissionsSetAction.payload);
    expect(isAdapterPermissionEnabledSelector(adapterPermissions, 'can-add-patient')).toEqual(true);
    expect(
      isAdapterPermissionEnabledSelector(adapterPermissions, 'can-update-appointment'),
    ).toEqual(false);
    expect(isAdapterPermissionEnabledSelector(adapterPermissions, 'can-set-ismissing')).toEqual(
      true,
    );
  });
  test('reducer works', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
    expect(reducer(initialState, loginSuccessAction)).toMatchSnapshot();
    expect(reducer(initialState, logoutAction)).toMatchSnapshot();
    expect(reducer(initialState, adapterPermissionsSetAction)).toMatchSnapshot();
  });
});
