
import axios from 'axios';
import { receiveEntities } from '../reducers/entities';

export function uploadAvatar(practitionerId, file) {
  return function (dispatch) {
    const data = new FormData();
    data.append('file', file);
    return axios.post(`/api/practitioners/${practitionerId}/avatar`, data).then((response) => {
      dispatch(receiveEntities({
        key: 'practitioners',
        entities: response.data.entities,
      }));
    });
  };
}

export function deleteAvatar(practitionerId) {
  return function (dispatch) {
    return axios.delete(`/api/practitioners/${practitionerId}/avatar`).then((response) => {
      dispatch(receiveEntities({
        key: 'practitioners',
        entities: response.data.entities,
      }));
    });
  };
}
