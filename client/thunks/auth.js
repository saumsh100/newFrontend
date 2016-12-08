
import { loginSuccess } from '../actions/auth';

export default function () {
  return function (dispatch, getState) {
    debugger
    const loginDetails = {
      username: getState().auth.get('username'),
      password: getState().auth.get('password'),
    }
    return fetch('/api/session', {
      method: 'post',
      body: JSON.stringify(loginDetails),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(response => response.json())
    .then(data => dispatch(loginSuccess(data)));
  };
}

