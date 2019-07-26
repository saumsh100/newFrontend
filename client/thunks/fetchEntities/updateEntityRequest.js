
import { receiveEntities } from '../../reducers/entities';
import { showAlertTimeout } from '../alerts';
import { httpClient } from '../../util/httpClient';

export default function updateEntityRequest({ key, model, values, url, alert, merge }) {
  url = url || model.getUrlRoot();
  values = values || model.toJSON();
  const errorText = errorCode =>
    (alert ? alert[errorCode] || alert.error : { body: `Update ${key} failed` });

  return dispatch =>
    httpClient()
      .put(url, values)
      .then((response) => {
        const { data } = response;
        dispatch(
          receiveEntities({
            key,
            entities: data.entities,
            merge,
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

        return data.entities;
      })
      .catch((err) => {
        dispatch(
          showAlertTimeout({
            alert: errorText(err.status),
            type: 'error',
          }),
        );
        throw err;
      });
}
