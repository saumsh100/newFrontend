
import axios from 'axios';
import jwt from 'jwt-decode';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form';
import { loginSuccess } from '../actions/auth';

export default function invite(location) {
  return function (dispatch, getState) {
    // TODO: this should really be refactored so we aren't accessing state for form values
    // TODO: change to use values onSubmit
    const { form: { login: { values } } } = getState();
    // reduxForm will not have this set if form is not dirty

    if (!values) {
      const error = 'Enter All Values';
      throw new SubmissionError({
        firstName: error,
        lastName: error,
        email: error,
        password: error,
        passwordConfirmation: error,
      });
    };

    const signUpDetails = {
      username: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      passwordConfirmation: values.passwordConfirmation,
    };

    const url = `/auth${location.pathname}`;

    return axios
      .post(url , signUpDetails)
      .then(({ data }) => {
        // set data in local storage
        localStorage.setItem('token', data.token);
        dispatch(loginSuccess(jwt(data.token)));
        dispatch(push('/'));
      })
      .catch((err) => {
        const { data } = err;
        throw new SubmissionError({
          firstName: data,
          lastName: data,
          email: data,
          password: data,
          passwordConfirmation: data,
        });
      });
  };
}
