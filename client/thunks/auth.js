import axios from 'axios';
import { loginSuccess } from '../actions/auth';

export default function () {
  return function (dispatch, getState) {
    const loginDetails = {
      username: getState().auth.get('username'),
      password: getState().auth.get('password'),
    }
    return axios
    .post('/api/session', loginDetails)
    .then(({data}) => {
      console.log(data.token)
      // set data in local storage
      localStorage.setItem('token', data.token)
      dispatch(loginSuccess(data))
    });
  };
}

