
import axios from 'axios';
import jwt from 'jwt-decode';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form';
import { loginSuccess } from '../actions/auth';

export default function login() {
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
      .post('/api/auth', loginDetails)
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
