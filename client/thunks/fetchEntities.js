
import _ from 'lodash';
import axios from 'axios';
import {
  receiveEntities,
  fetchModel,
  deleteEntity,
  addEntity,
  updateEntity,
} from '../actions/entities';

import {
  showAlertTimeout,
} from './alerts';

import { createRequest, receiveRequest, errorRequest } from '../reducers/apiRequests';

export function fetchEntities({ key, join, params = {}, url }) {
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
    return axios.get(url, { params })
      .then((response) => {
        const { data } = response;
        dispatch(receiveEntities({ key, entities: data.entities }));
        return data.entities;
      })
      .catch((err) => {
        // TODO: set didInvalidate=true of entity and dispatch alert action
        console.log(err);
      });
  };
}

export function fetchEntitiesRequest({ id, key, base, join, params = {}, url }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    // Add onto the query param for join if passed in
    if (join && join.length) {
      params.join = join.join(',');
    }

    url = url || entity.getUrlRoot(base);

    // Create record for request
    dispatch(createRequest({ id }));

    return axios.get(url, { params })
      .then((response) => {
        const { data } = response;
        dispatch(receiveRequest({ id, data }));
        dispatch(receiveEntities({ key, entities: data.entities }));
        return data.entities;
      })
      .catch((error) => {
        // TODO: set didInvalidate=true of entity and dispatch alert action
        errorRequest({ id, error });
        throw error;
      });
  };
}

export function deleteEntityRequest({ key, id, url, alert }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    url = url || `${entity.getUrlRoot()}/${id}`;

    const keyStr = key.substring(0, key.length - 1);
    const errorText = alert ? alert.error : { body: `Delete ${keyStr} failed` };

    axios.delete(url)
      .then(() => {
        dispatch(deleteEntity({ key, id }));
        if (alert && alert.success) {
          dispatch(showAlertTimeout({ alert: alert.success, type: 'success' }));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(showAlertTimeout({ alert: errorText, type: 'error' }));
        throw err;
      });
  };
}

export function deleteEntityCascade({ key, id, url, cascadeKey, ids }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);

    url = url || `${entity.getUrlRoot()}/${id}`;

    axios.delete(url)
      .then(() => {
        if (cascadeKey) {
          ids.forEach((singleId) => {
            dispatch(deleteEntity({ key: cascadeKey, id: singleId }));
          });
        }
        dispatch(deleteEntity({ key, id }));
      })
      .catch(err => console.log(err));
  };
}


export function createEntityRequest({ key, entityData, url, params = {}, alert }) {
  console.log('inside createEntityRequest; url=', url);
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    url = url || entity.getUrlRoot();

    const errorText = alert ? alert.error : { body: `${key} creation failed` };

    return axios.post(url, entityData, { params })
      .then((response) => {
        const { data } = response;
        console.log('in then response=', response);
        dispatch(receiveEntities({ key, entities: data.entities }));

        if (alert && alert.success) {
          dispatch(showAlertTimeout({ alert: alert.success, type: 'success' }));
        }
        return data.entities;
      })
      .catch((err) => {
        dispatch(showAlertTimeout({ alert: errorText, type: 'error' }));
        throw err;
      });
  };
}

export function updateEntityRequest({ key, model, values, url, alert }) {
  url = url || model.getUrlRoot();
  values = values || model.toJSON();

  const errorText = alert ? alert.error : { body: `Update ${key} failed` };

  return dispatch => axios.put(url, values)
      .then((response) => {
        const { data } = response;
        dispatch(receiveEntities({ key, entities: data.entities }));

        if (alert && alert.success) {
          dispatch(showAlertTimeout({ alert: alert.success, type: 'success' }));
        }
        return data.entities;
      })
      .catch((err) => {
        dispatch(showAlertTimeout({ alert: errorText, type: 'error' }));
        throw err;
      });
}
