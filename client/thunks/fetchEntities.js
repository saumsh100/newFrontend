
import axios from 'axios';
import { receiveEntities } from '../actions/entities';

export default function fetchEntities({ key, data }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    console.log('key', key);
    console.log('entity', entity);
    
    axios.get(entity.getUrlRoot())
      .then((response) => {
        const { data } = response;
        dispatch(receiveEntities({ key, entities: data.entities }));
      })
      .catch((err) => {
        // TODO: set didInvalidate=true of entity and dispatch alert action
        console.log(err);
      });
  };
}
