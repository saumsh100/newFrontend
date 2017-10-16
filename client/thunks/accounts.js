
import axios from 'axios';
import FileSaver from 'file-saver';
import { receiveEntities } from '../actions/entities';
import { showAlertTimeout } from '../thunks/alerts';


export function uploadLogo(accountId, file) {
  return function (dispatch, getState) {
    const data = new FormData();
    data.append('file', file);

    const alert = {
      success: {
        body: 'Logo has been uploaded',
      },
      error: {
        body: 'Logo failed to upload',
      },
    };

    return axios
      .post(`/api/accounts/${accountId}/logo`, data)
      .then((response) => {
        dispatch(receiveEntities({ key: 'accounts', entities: response.data.entities }));
        dispatch(showAlertTimeout({ alert: alert.success, type: 'success' }));
      });
  };
}

export function deleteLogo(accountId) {
  return function (dispatch, getState) {

    const alert = {
      success: {
        body: 'Logo has been removed',
      },
      error: {
        body: 'Logo removal failed',
      },
    };

    return axios
      .delete(`/api/accounts/${accountId}/logo`)
      .then((response) => {
        dispatch(receiveEntities({ key: 'accounts', entities: response.data.entities }));
        dispatch(showAlertTimeout({ alert: alert.success, type: 'success' }));
      });
  };
}

export function downloadConnector() {
  return function (dispatch, getState) {

    return axios
      .get('/api/connector/download')
      .then(response => response.data);
  };
}
