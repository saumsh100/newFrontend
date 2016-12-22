
import axios from 'axios';
import { receiveEntities, deleteEntity } from '../actions/entities';

export function fetchEntities({ key, data }) {
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

export function fetchDelete(key, id) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    axios.delete(`${entity.getUrlRoot()}/${id}`)
      .then((response) => {
        const { data } = response;
        dispatch(deleteEntity({ entities: data.entities }));
      })
      .catch(err => console.log(err));
  };
}

export function fetchPost(patient) {
  return (dispatch) => {
    axios.post('/api/patients', patient)
      .then(response => console.log(response))
      .catch(err => console.log(err));
  };
}

export function fetchUpdate(patient) {
  return (dispatch, getState) => {
    axios.put(`/api/patients/${patient.id}`, patient)
      .then(response => console.log(response))
      .catch(err => console.log(err));
  }
}
