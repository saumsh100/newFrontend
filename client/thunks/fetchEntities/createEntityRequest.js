import { receiveEntities } from '../../reducers/entities';
import { showAlertTimeout } from '../alerts';
import { httpClient } from '../../util/httpClient';

export default function createEntityRequest({ key, entityData, url, params = {}, alert }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    url = url || entity.getUrlRoot();

    const errorText = alert ? alert.error : { body: `${key} creation failed` };

    return httpClient()
      .post(url, entityData, { params })
      .then((response) => {
        const { data } = response;
        dispatch(
          receiveEntities({
            key,
            entities: data.entities,
          }),
        );
        if (alert && alert.success) {
          dispatch(
            showAlertTimeout({
              alert: alert.success,
              type: 'success',
            }),
          );
        }
        if (alert?.error && data?.smsStatus === 'failed') {
          dispatch(
            showAlertTimeout({
              alert: alert.error,
              type: 'error',
            }),
          );
        }
        if (key === 'chats') {
          return data;
        }
        return data.entities;
      })
      .catch((err) => {
        dispatch(
          showAlertTimeout({
            alert: errorText,
            type: 'error',
          }),
        );
        throw err;
      });
  };
}
