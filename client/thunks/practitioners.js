
import { receiveEntities } from '../reducers/entities';
import { httpClient } from '../util/httpClient';

export function uploadAvatar(practitionerId, file) {
  return function (dispatch) {
    const data = new FormData();
    data.append('file', file);
    return httpClient()
      .post(`/api/practitioners/${practitionerId}/avatar`, data)
      .then((response) => {
        dispatch(
          receiveEntities({
            key: 'practitioners',
            entities: response.data.entities,
          }),
        );
      });
  };
}

export function deleteAvatar(practitionerId) {
  return function (dispatch) {
    return httpClient()
      .delete(`/api/practitioners/${practitionerId}/avatar`)
      .then((response) => {
        dispatch(
          receiveEntities({
            key: 'practitioners',
            entities: response.data.entities,
          }),
        );
      });
  };
}
