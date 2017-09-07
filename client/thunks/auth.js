
import axios from 'axios';
import jwt from 'jwt-decode';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form';
import LogRocket from 'logrocket';
import { loginSuccess, logout as authLogout } from '../actions/auth';
import connectSocketToStoreLogin from '../socket/connectSocketToStoreLogin';
import socket from '../socket';

const updateSessionByToken = (token, dispatch, invalidateSession = true) => {
  localStorage.setItem('token', token);
  const { sessionId } = jwt(token);

  if (invalidateSession) {
    localStorage.removeItem('session');
  }

  const getSession = () => {
    /*const cachedValue = localStorage.getItem('session');
    return cachedValue ?
      (Promise.resolve(JSON.parse(cachedValue))) :
      (axios.get('/api/users/me').then(({ data }) => data));*/
    // This adds req.header only because it's been added elsewhere
    return axios.get('/api/users/me').then(({ data }) => data);
  };

  return getSession()
    .then((session) => {
      const userSession = { ...session, sessionId };
      localStorage.setItem('session', JSON.stringify(userSession));
      console.log('userSession', userSession);
      dispatch(loginSuccess(userSession));
      return userSession;
    })
    .catch((err) => {
      debugger;
      // Catch 401 from /api/users/me and logout
      localStorage.removeItem('token');
      localStorage.removeItem('session');
      dispatch(authLogout());
      dispatch(push('./login'));
    });
};

export function login(values, redirectedFrom = '/', connect = false) {
  return function (dispatch, getState) {
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
        const userId = user.id;
        const fullName = `${user.firstName} ${user.lastName}`;
        const email = user.username;
        if (connect && process.env.NODE_ENV === 'production') {
          LogRocket.identify(userId, {
            name: fullName,
            email: email,
          });

          window.Intercom('update', {
            user_id: userId,
            name: fullName,
            email,
            created_at: user.createdAt,
            logrocketURL: `https://app.logrocket.com/${process.env.LOGROCKET_APP_ID}/sessions?u=${userId}`,
          });
        }

        connectSocketToStoreLogin({ dispatch, getState }, socket);

        // dispatch(loginSuccess(decodedToken));
        dispatch(push(redirectedFrom));
      });
  };
}

const reloadPage = () => {
  window.location = window.location.pathname;
};

export function switchActiveAccount(accountId, redirectTo = '/') {
  return dispatch =>
    axios.post(`/api/accounts/${accountId}/switch`, {})
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
      .then(() => dispatch(push(redirectTo)))
      .then(reloadPage);
}

export function switchActiveEnterprise(enterpriseId, redirectTo = '/') {
  return dispatch =>
    axios.post('/api/enterprises/switch', { enterpriseId })
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
      .then(() => dispatch(push(redirectTo)))
      .then(reloadPage);
}

export function logout() {
  return (dispatch, getState) => {
    localStorage.removeItem('token');
    localStorage.removeItem('session');
    const { auth } = getState();

    return axios.delete(`/auth/session/${auth.get('sessionId')}`)
      .then(() => {
        dispatch(authLogout());
        dispatch(push('/login'));
      });
  };
}

export function resetPassword(email) {
  return (dispatch, getState) => {
    return axios.post('/auth/resetpassword', { email })
      .then(() => {
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function resetUserPassword(location, values) {
  return (dispatch, getState) => {
    const url = `${location.pathname}`;
    return axios
      .post(url, values)
      .then(()=> {
        dispatch(push('/login'));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function load() {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.resolve(null);
    }

    return updateSessionByToken(token, dispatch, false);
  };
}
