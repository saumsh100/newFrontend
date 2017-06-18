
import axios from 'axios';
import { receiveEntities } from '../actions/entities';

export function uploadLogo(accountId, file) {
  return function (dispatch, getState) {
    const data = new FormData();
    data.append('file', file);
    return axios
      .post(`/api/accounts/${accountId}/logo`, data)
      .then((response) => {
        dispatch(receiveEntities({ key: 'accounts', entities: response.data.entities }));
      });
  };
}

export function deleteLogo(accountId) {
  return function (dispatch, getState) {
    return axios
      .delete(`/api/accounts/${accountId}/logo`)
      .then((response) => {
        dispatch(receiveEntities({ key: 'accounts', entities: response.data.entities }));
      });
  };
}
