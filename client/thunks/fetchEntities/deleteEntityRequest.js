
import axios from 'axios';
import { deleteEntity } from '../../actions/entities';
import { showAlertTimeout } from '../alerts';

export default function deleteEntityRequest({ key, id, url, values, alert }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    url = url || `${entity.getUrlRoot()}/${id}`;

    const keyStr = key.substring(0, key.length - 1);
    const errorText = alert ? alert.error : { body: `Delete ${keyStr} failed` };

    return axios
      .delete(url, { params: values })
      .then(() => {
        dispatch(deleteEntity({
          key,
          id,
        }));
        if (alert && alert.success) {
          dispatch(showAlertTimeout({
            alert: alert.success,
            type: 'success',
          }));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(showAlertTimeout({
          alert: errorText,
          type: 'error',
        }));
        throw err;
      });
  };
}
