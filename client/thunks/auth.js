import axios from 'axios';
import { loginSuccess } from '../actions/auth';
import jwt from 'jwt-decode';
import { push } from 'react-router-redux'

export default function () {
  return function (dispatch, getState) {
    const loginDetails = {
      username: getState().auth.get('username'),
      password: getState().auth.get('password'),
    };
    return axios
    .post('/api/session', loginDetails)
    .then(({ data }) => {
      // set data in local storage
      localStorage.setItem('token', data.token);
      dispatch(loginSuccess(jwt(data.token)));
      dispatch(push('/'))
    });
  };
}
