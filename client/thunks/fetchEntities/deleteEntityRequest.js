
import { deleteEntity } from '../../reducers/entities';
import { showAlertTimeout } from '../alerts';
import { httpClient } from '../../util/httpClient';

export default function deleteEntityRequest({ key, id, url, values, alert }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    url = url || `${entity.getUrlRoot()}/${id}`;

    const keyStr = key.substring(0, key.length - 1);
    const errorText = alert ? alert.error : { body: `Delete ${keyStr} failed` };

    return httpClient()
      .delete(url, { params: values })
      .then(({ data }) => {
        dispatch(
          deleteEntity({
            key,
            id,
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
        return data;
      })
      .catch((err) => {
        console.error(err);
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
