
import jwt from 'jwt-decode';
import { push } from 'connected-react-router';
import { SubmissionError } from 'redux-form';
import { loginSuccess, authLogout } from '../../reducers/auth';
import { setDashboardDate } from '../../reducers/dashboard';
import { setScheduleDate } from '../../actions/schedule';
import { updateFeatureFlagsContext, resetFeatureFlagsState } from '../featureFlags';
import connectSocketToStoreLogin from '../../socket/connectSocketToStoreLogin';
import SubscriptionManager from '../../util/graphqlSubscriptions';
import { httpClient, bookingWidgetHttpClient } from '../../util/httpClient';
import socket from '../../socket';
import { getTodaysDate } from '../../components/library';

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

const loginHttp = (url, body, redirectedFrom) => (dispatch, getState) =>
  httpClient()
    .post(url, body)
    .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
    .then((session) => {
      const { accountId, timezone } = session;
      SubscriptionManager.accountId = accountId;
      connectSocketToStoreLogin(
        {
          dispatch,
          getState,
        },
        socket,
      );

      // set dates
      dispatch(setDashboardDate(getTodaysDate(timezone).toISOString()));
      dispatch(setScheduleDate({ scheduleDate: getTodaysDate(timezone).toISOString() }));

      dispatch(push(redirectedFrom));
    });

export const loginSSO = ({ code, redirectedFrom = '/' }) => {
  if (typeof code !== 'string') return Promise.resolve(null);

  return loginHttp('/auth/sso', { code }, redirectedFrom);
};

export const login = ({ values, redirectedFrom = '/' }) => {
  // reduxForm will not have this set if form is not dirty
  if (!values) return Promise.resolve(null);
  const loginDetails = {
    username: values.email,
    password: values.password,
  };

  return loginHttp('/auth', loginDetails, redirectedFrom);
};

const reloadPage = () => {
  window.location = window.location.pathname;
};

/**
 * Check if the current route is either a chat or a patient page,
 * if so we need to sanitize the url and return it to the list view,
 * that's needed because chats and patients are not shared between accounts.
 * @param redirectTo
 * @return {*}
 */
const cleanRedirect = (redirectTo) => {
  const urlsToParse = new RegExp(/(\/(chat|patients)\/)(.*)/);
  const result = redirectTo.match(urlsToParse);

  if (Array.isArray(result)) {
    return result[1];
  }
  return redirectTo;
};

export function switchActiveAccount(accountId, redirectTo = '/') {
  return dispatch =>
    httpClient()
      .post(`/api/accounts/${accountId}/switch`, {})
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
      .then(() => dispatch(push(cleanRedirect(redirectTo))))
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
    sessionStorage.removeItem('scheduleDate');
    sessionStorage.removeItem('dashboardDate');
    const { auth } = getState();
    const isSSO = auth.getIn(['user', 'isSSO'], false);
    const url = isSSO ? '/auth/sso/session/' : '/auth/session/';

    return httpClient()
      .delete(url.concat(auth.get('sessionId')))
      .then(({ data }) => {
        dispatch(resetFeatureFlagsState());
        dispatch(authLogout());
        SubscriptionManager.accountId = null;
        const action = isSSO ? push('/redirect', { redirectUrl: data.logoutUrl }) : push('/login');

        return dispatch(action);
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

const resetUserPasswordFactory = (client, path, values) =>
  client()
    .post(`${path}`, values)
    .catch((err) => {
      const { data } = err;
      throw new SubmissionError({
        password: data,
        confirmPassword: data,
      });
    });

export function resetUserPassword(location, values) {
  return () => resetUserPasswordFactory(httpClient, location.pathname, values);
}

export function resetPatientPassword(location, values) {
  return () => resetUserPasswordFactory(bookingWidgetHttpClient, location.pathname, values);
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
