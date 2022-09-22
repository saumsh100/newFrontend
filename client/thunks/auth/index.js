import axios from 'axios';
import jwt from 'jwt-decode';
import { push } from 'connected-react-router';
import { SubmissionError } from 'redux-form';
import { loginSuccess, authLogout } from '../../reducers/auth';
import { setDashboardDate } from '../../reducers/dashboard';
import { setScheduleDate } from '../../actions/schedule';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';
import { updateFeatureFlagsContext, resetFeatureFlagsState } from '../featureFlags';
import connectSocketToStoreLogin from '../../socket/connectSocketToStoreLogin';
import SubscriptionManager from '../../util/graphqlSubscriptions';
import { httpClient, bookingWidgetHttpClient } from '../../util/httpClient';
import socket from '../../socket';
import { getTodaysDate } from '../../components/library';

const updateSessionByToken = (token, dispatch, invalidateSession = true) => {
  let sessionId;
  if (token && token !== null) {
    localStorage.setItem('token', token);
    ({ sessionId } = jwt(token));
  }

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
  return (dispatch) =>
    httpClient()
      .post(`/api/accounts/${accountId}/switch`, {})
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
      .then(() => dispatch(push(cleanRedirect(redirectTo))))
      .then(reloadPage);
}

export function switchActiveEnterprise(enterpriseId, redirectTo = '/') {
  return (dispatch) =>
    httpClient()
      .post('/api/enterprises/switch', { enterpriseId })
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
      .then(() => dispatch(push(redirectTo)))
      .then(reloadPage);
}

export function logout() {
  return async (dispatch, getState) => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('scheduleDate');
    sessionStorage.removeItem('dashboardDate');
    const { auth, featureFlags } = getState();
    const isSSO = auth.getIn(['user', 'isSSO'], false);
    const url = isSSO ? '/auth/sso/session/' : '/auth/session/';

    const isEnterpriseManagementAuthEnabled = isFeatureEnabledSelector(
      featureFlags.get('flags'),
      'enterprise-management-authentication',
    );

    if (!isEnterpriseManagementAuthEnabled) {
      return httpClient()
        .delete(url.concat(auth.get('sessionId')))
        .then(({ data }) => {
          dispatch(resetFeatureFlagsState());
          dispatch(authLogout());
          SubscriptionManager.accountId = null;
          const action = isSSO
            ? push('/redirect', { redirectUrl: data.logoutUrl })
            : push('/login');
          return dispatch(action);
        });
    }

    // If Enterprise Management Authentication is enabled we use kratos to log the user out.
    try {
      const rootUrl = `${window.location.protocol}//${window.location.hostname}`;
      const { data } = await axios.get(`${rootUrl}/kratos/self-service/logout/browser`);
      await axios.get(data.logout_url);
      dispatch(resetFeatureFlagsState());
      SubscriptionManager.accountId = null;
      window.location.href = `${rootUrl}/auth/login`;
    } catch (error) {
      console.error('failed to log out', error);
    }
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

    // Unless we are in password reset flow, signup flow or sso flow, attempt to load the page without token
    // This allows us to support kratos authentication which uses a HTTP only session cookie
    // Requests sent to the backend with this cookie will be authenticated by kratos and oathkeeper
    const { pathname } = window.location;
    if (
      !token &&
      (pathname.includes('/resetpassword/') ||
        pathname.includes('/signup/') ||
        pathname.includes('/sso/'))
    ) {
      return Promise.resolve(null);
    }

    return updateSessionByToken(token, dispatch, false);
  };
}
