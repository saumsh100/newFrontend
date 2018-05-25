
import { electron } from '../util/ipc';
import { REQUEST_USER_DATA, SET_USER_DATA, SHOW_TOOLBAR } from '../constants';
import { login as MainLogin, logout as MainLogout } from './auth';

export function login() {
  const argumentsList = arguments;
  return (dispatch, getState) =>
    dispatch(MainLogin(...argumentsList)).then(() => {
      const { auth } = getState();
      const user = auth.get('user').toJS();

      electron.send(SHOW_TOOLBAR, {
        location: window.location.href,
        isAuth: true,
      });

      electron.on(REQUEST_USER_DATA, (event) => {
        event.sender.send(SET_USER_DATA, {
          user,
          role: auth.get('role'),
        });
      });
    });
}

export function logout() {
  const argumentsList = arguments;
  return dispatch =>
    dispatch(MainLogout(...argumentsList)).then(() => {
      electron.send(SHOW_TOOLBAR, {
        location: false,
        isAuth: false,
      });
    });
}
