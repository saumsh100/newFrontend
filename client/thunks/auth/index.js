
import jwt from 'jwt-decode';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form';
import LogRocket from 'logrocket';
import { loginSuccess, authLogout } from '../../reducers/auth';
import { updateFeatureFlagsContext, resetFeatureFlagsState } from '../featureFlags';
import connectSocketToStoreLogin from '../../socket/connectSocketToStoreLogin';
import connectSocketToConnectStore from '../../socket/connectSocketToConnectStore';
import SubscriptionManager from '../../util/graphqlSubscriptions';
import { httpClient } from '../../util/httpClient';
import socket from '../../socket';

const updateSessionByToken = (token, dispatch, invalidateSession = true) => {
  localStorage.setItem('token', token);
  const { sessionId } = jwt(token);

  if (invalidateSession) {
    localStorage.removeItem('session');
  }

  const getSession = () =>
    httpClient()
      .get('/api/users/me')
      .then(({ data }) => data);

  return getSession()
    .then((session) => {
      const userSession = {
        ...session,
        sessionId,
      };
      localStorage.setItem('session', JSON.stringify(userSession));

      const { user } = userSession;
      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.username,
        key: userSession.userId,
        custom: {
          domain: window.location.hostname,
          plan: userSession.enterprise.plan,
          role: userSession.role,
          accountId: userSession.accountId,
          enterpriseName: userSession.enterprise.name,
          enterpriseId: userSession.enterprise.id,
          adapterType: userSession.adapterType,
        },
      };

      dispatch(updateFeatureFlagsContext(userData));
      dispatch(loginSuccess(userSession));
      return userSession;
    })
    .catch((error) => {
      console.error(error);
      // Catch 401 from /api/users/me and logout
      localStorage.removeItem('token');
      localStorage.removeItem('session');
      dispatch(authLogout());
      dispatch(push('./login'));
    });
};

export function login({ values, redirectedFrom = '/', connect = false }) {
  return function (dispatch, getState) {
    // reduxForm will not have this set if form is not dirty
    if (!values) return Promise.resolve(null);

    const loginDetails = {
      username: values.email,
      password: values.password,
    };

    return httpClient()
      .post('/auth', loginDetails)
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
      .then(({ user, accountId }) => {
        const userId = user.id;
        const fullName = `${user.firstName} ${user.lastName}`;
        const email = user.username;
        if (connect && process.env.NODE_ENV === 'production') {
          LogRocket.identify(userId, {
            name: fullName,
            email,
          });

          window.Intercom('update', {
            user_id: userId,
            name: fullName,
            email,
            created_at: user.createdAt,
            logrocketURL: `https://app.logrocket.com/${
              process.env.LOGROCKET_APP_ID
            }/sessions?u=${userId}`,
          });
        }

        SubscriptionManager.accountId = accountId;

        if (connect) {
          connectSocketToConnectStore(
            {
              dispatch,
              getState,
            },
            socket,
          );
        } else {
          connectSocketToStoreLogin(
            {
              dispatch,
              getState,
            },
            socket,
          );
        }

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
    httpClient()
      .post(`/api/accounts/${accountId}/switch`, {})
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
      .then(() => dispatch(push(redirectTo)))
      .then(reloadPage);
}

export function switchActiveEnterprise(enterpriseId, redirectTo = '/') {
  return dispatch =>
    httpClient()
      .post('/api/enterprises/switch', { enterpriseId })
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
      .then(() => dispatch(push(redirectTo)))
      .then(reloadPage);
}

export function logout() {
  return (dispatch, getState) => {
    localStorage.removeItem('token');
    localStorage.removeItem('session');
    const { auth } = getState();

    return httpClient()
      .delete(`/auth/session/${auth.get('sessionId')}`)
      .then(() => {
        dispatch(resetFeatureFlagsState());
        dispatch(authLogout());
        dispatch(push('/login'));
        SubscriptionManager.accountId = null;
      });
  };
}

export function resetPassword(email) {
  return () =>
    httpClient()
      .post('/auth/resetpassword', { email })
      .then(() => {})
      .catch((err) => {
        throw new SubmissionError(err.data, err.status);
      });
}

export function resetUserPassword(location, values) {
  return () =>
    httpClient()
      .post(`${location.pathname}`, values)
      .catch((err) => {
        const { data } = err;
        throw new SubmissionError({
          password: data,
          confirmPassword: data,
        });
      });
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
