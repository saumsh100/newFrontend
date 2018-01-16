
import axios from 'axios';
import jwt from 'jwt-decode';
import LogRocket from 'logrocket';
import { loginSuccess, logout as authLogout, setResetEmail } from '../actions/auth';
import PatientUser from '../entities/models/PatientUser';

const Token = {
  key: 'auth_token',
  save(value) {
    localStorage.setItem(this.key, value);
  },

  remove() {
    localStorage.removeItem(this.key);
  },

  get() {
    return localStorage.getItem(this.key);
  },
};

const updateSessionByToken = (token, dispatch) => {
  // Set token in local storage
  Token.save(token);
  return fetchPatient()
    .then((session) => {
      const sessionId = session.sessionId;
      const patientUser = new PatientUser(session.patientUser);

      // set's isAuthenticated and user data
      dispatch(loginSuccess({ sessionId, patientUser }));
      return patientUser;
    })
    .catch((err) => {
      // Catch 401 from /auth/me and logout, or errors from React renders
      Token.remove();
      dispatch(authLogout());
      throw err;
    });
};

export function login(credentials) {
  return function (dispatch) {
    return axios.post('/auth', credentials)
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch))
      .then((patientUser) => {
        LogRocket.identify(patientUser.id, {
          name: `${patientUser.firstName} ${patientUser.lastName}`,
          email: patientUser.email,
        });
      });
  };
}

export function logout() {
  return (dispatch, getState) => {
    Token.remove();
    const { auth } = getState();
    return axios.delete(`/auth/session/${auth.get('sessionId')}`)
      .then(() => {
        dispatch(authLogout());
      });
  };
}

export function resetPatientUserPassword(email) {
  return (dispatch, getState) => {
    const { availabilities } = getState();
    const accountId = availabilities.getIn(['account', 'id']);
    return axios.post(`/auth/reset/${accountId}`, { email })
      .then(() => {
        dispatch(setResetEmail(email));
      });
  };
}

export function loadPatient() {
  return (dispatch) => {
    const token = Token.get();
    // TODO: Should we be testing expiry here as well?
    if (!token) {
      return Promise.resolve(null);
    }

    return updateSessionByToken(token, dispatch);
  };
}

// TODO: make this like the sync data
const fetchPatient = () => {
  return axios.get('/auth/me').then(({ data }) => data);
};

export function createPatient(values, ignoreConfirmationText) {
  return function (dispatch, getState) {
    const { availabilities } = getState();

    const config = ignoreConfirmationText ? { params: { ignoreConfirmationText: true } } : null;
    const accountId = availabilities.getIn(['account', 'id']);

    return axios.post(`/auth/signup/${accountId}`, values, config)
      // TODO: dispatch function that successfully created patient, plug in, confirm code
      // TODO: then allow them to create the patient
      .then(({ data: { token } }) => updateSessionByToken(token, dispatch).then(() => token));
  };
}
