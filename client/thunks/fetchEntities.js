
import axios from 'axios';
import { receiveEntities, deleteEntity, addEntity, updateEntity } from '../actions/entities';

export function fetchEntities({ key }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
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

export function fetchDelete({ key, id }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    axios.delete(`${entity.getUrlRoot()}/${id}`)
      .then((response) => {
        const { data } = response;
        dispatch(deleteEntity({ key, entity: data.entities }));
      })
      .catch(err => console.log(err));
  };
}

export function fetchPost({ key, patient }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    axios.post(entity.getUrlRoot(), patient)
      .then((response) => {
        const { data } = response;
        dispatch(addEntity({ key, entity: data.entities }));
      })
      .catch(err => console.log(err));
  };
}

export function fetchUpdate({ key, patient }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    axios.put(`${entity.getUrlRoot()}/${patient.id}`, patient)
      .then((response) => {
        const { data } = response;
        dispatch(updateEntity({ key, entity: data.entities }));
      })
      .catch(err => console.log(err));
  };
}
