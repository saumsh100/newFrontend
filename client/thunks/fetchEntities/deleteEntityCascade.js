
import axios from 'axios';
import { deleteEntity } from '../../reducers/entities';

export default function deleteEntityCascade({ key, id, url, cascadeKey, ids }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);

    url = url || `${entity.getUrlRoot()}/${id}`;

    return axios
      .delete(url)
      .then(() => {
        if (cascadeKey) {
          ids.forEach((singleId) => {
            dispatch(deleteEntity({
              key: cascadeKey,
              id: singleId,
            }));
          });
        }
        dispatch(deleteEntity({
          key,
          id,
        }));
      })
      .catch(err => console.log(err));
  };
}
