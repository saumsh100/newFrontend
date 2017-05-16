
import axios from 'axios';
import jwt from 'jwt-decode';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form';
import { loginSuccess, logout as authLogout } from '../actions/auth';

export function login(redirectedFrom = '/') {
  return function (dispatch, getState) {
    // TODO: this should really be refactored so we aren't accessing state for form values
    // TODO: change to use values onSubmit
    const { form: { login: { values } } } = getState();
    // reduxForm will not have this set if form is not dirty
    if (!values) return;
    const loginDetails = {
      username: values.email,
      password: values.password,
    };

    return axios
      .post('/auth', loginDetails)
      .then(({ data }) => {
        // set data in local storage
        localStorage.setItem('token', data.token);
        dispatch(loginSuccess(jwt(data.token)));
        dispatch(push(redirectedFrom));
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

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch(authLogout());
    dispatch(push('/login'));
  };
}

export function load() {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    // We need to catch invalid token and remove them
    try {
      const decodedToken = jwt(token);
      const expired = (decodedToken.exp - (Date.now() / 1000)) < 0;

      expired ? logout()(dispatch) : dispatch(loginSuccess(decodedToken));
    } catch (error) {
      logout()(dispatch);
    }
  };
}
