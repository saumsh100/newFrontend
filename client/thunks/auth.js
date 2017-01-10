
import axios from 'axios';
import jwt from 'jwt-decode';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form';
import { loginSuccess } from '../actions/auth';

export default function login() {
  return function (dispatch, getState) {
    const { form: { login: { values: { email, password } } } } = getState();
    const loginDetails = {
      username: email,
      password,
    };
    
    return axios
      .post('/api/session', loginDetails)
      .then(({ data }) => {
        // set data in local storage
        localStorage.setItem('token', data.token);
        dispatch(loginSuccess(jwt(data.token)));
        dispatch(push('/'));
      })
      .catch((err) => {
        const { data } = err;
        throw new SubmissionError({
          email: data,
          password: data,
        });
      });
  };
}
