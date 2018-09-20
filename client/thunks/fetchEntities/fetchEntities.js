
import axios from 'axios';
import { receiveEntities } from '../../actions/entities';

export default function fetchEntities({ key, join, params = {}, url }) {
  return (dispatch, getState) => {
    // adding this so pass by reference params won't go for mulitple requests
    params = Object.assign({}, params);
    const { entities } = getState();
    const entity = entities.get(key);
    // Add onto the query param for join if passed in
    if (join && join.length) {
      params.join = join.join(',');
    }
    url = url || entity.getUrlRoot();
    return axios
      .get(url, { params })
      .then((response) => {
        const { data } = response;
        dispatch(receiveEntities({
          key,
          entities: data.entities,
        }));
        return data.entities;
      })
      .catch((err) => {
        // TODO: set didInvalidate=true of entity and dispatch alert action
        console.log(err);
      });
  };
}
