
import axios from 'axios';
import moment from 'moment';
import { receiveEntities } from '../reducers/entities';
import { updateEntityRequest } from './fetchEntities';
import { showAlertTimeout } from '../thunks/alerts';

export function uploadLogo(accountId, file) {
  return function (dispatch) {
    const data = new FormData();
    data.append('file', file);

    const alert = {
      success: { body: 'Logo has been uploaded' },
      error: { body: 'Logo failed to upload' },
    };

    return axios.post(`/api/accounts/${accountId}/logo`, data).then((response) => {
      dispatch(receiveEntities({
        key: 'accounts',
        entities: response.data.entities,
      }));
      dispatch(showAlertTimeout({
        alert: alert.success,
        type: 'success',
      }));
    });
  };
}

export function deleteLogo(accountId) {
  return function (dispatch) {
    const alert = {
      success: { body: 'Logo has been removed' },
      error: { body: 'Logo removal failed' },
    };

    return axios.delete(`/api/accounts/${accountId}/logo`).then((response) => {
      dispatch(receiveEntities({
        key: 'accounts',
        entities: response.data.entities,
      }));
      dispatch(showAlertTimeout({
        alert: alert.success,
        type: 'success',
      }));
    });
  };
}

export function downloadConnector() {
  return function () {
    return axios.get('/api/connector/download').then(response => response.data);
  };
}

export function sendEmailBlast(accountId) {
  return function (dispatch) {
    const alert = {
      success: { body: 'Email Campaign Successful' },
      error: { body: 'Email Campaign Failed' },
    };

    dispatch(showAlertTimeout({
      alert: alert.success,
      type: 'success',
    }));

    return axios.post(`/api/accounts/${accountId}/onlineBookingEmailBlast`, {
      startDate: moment()
        .subtract(5, 'years')
        .toISOString(),
      endDate: moment().toISOString(),
    });
  };
}

export function getEmailBlastCount(accountId) {
  return function () {
    return axios.get(`/api/accounts/${accountId}/onlineBookingEmailBlastCount`, {
      startDate: moment()
        .subtract(5, 'years')
        .toISOString(),
      endDate: moment().toISOString(),
    });
  };
}

export function updateReviewsSettings(accountId, values, alert) {
  return dispatch =>
    dispatch(updateEntityRequest({
      key: 'accounts',
      url: `/api/accounts/${accountId}`,
      values,
      alert,
    }));
}
