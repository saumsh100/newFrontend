
import axios from 'axios';
import jwt from 'jwt-decode';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form';
import LogRocket from 'logrocket';
import { loginSuccess, logout as authLogout } from '../actions/auth';

const updateSessionByToken = (token, dispatch) => {
  localStorage.setItem('token', token);
  const { tokenId } = jwt(token);

  return axios.get('/api/users/me')
    .then(({ data }) => {
      const userSession = { ...data, tokenId };
      localStorage.setItem('session', JSON.stringify(userSession));
      dispatch(loginSuccess(userSession));
      return userSession;
    });
};

export function login(redirectedFrom = '/') {
  return function (dispatch, getState) {
    // TODO: this should really be refactored so we aren't accessing state for form values
    // TODO: change to use values onSubmit
    const { form: { login: { values } } } = getState();

    // reduxForm will not have this set if form is not dirty
    if (!values) return Promise.resolve(null);

    const loginDetails = {
      username: values.email,
      password: values.password,
    };

    return axios
      .post('/auth', loginDetails)
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
      .then(({ user }) => {
        LogRocket.identify(user.id, {
          name: `${user.firstName} ${user.lastName}`,
          email: user.username,
        });

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

export function switchActiveAccount(accountId, redirectTo = '/') {
  return dispatch =>
    axios.post(`/api/accounts/${accountId}/switch`, {})
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
      .then(() => dispatch(push(redirectTo)));
}

export function switchActiveEnterprise(enterpriseId, redirectTo = '/') {
  return dispatch =>
    axios.post('/api/enterprises/switch', { enterpriseId })
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
      .then(() => dispatch(push(redirectTo)));
}

export function logout() {
  return (dispatch, getState) => {
    localStorage.removeItem('token');
    localStorage.removeItem('session');
    const { auth } = getState();

    return axios.delete(`/auth/token/${auth.get('tokenId')}`)
      .then(() => {
        dispatch(authLogout());
        dispatch(push('/login'));
      });
  };
}

export function load() {
  return (dispatch) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return Promise.resolve(null);
    }

    return updateSessionByToken(token, dispatch);
  };
}
