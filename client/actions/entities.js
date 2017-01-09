
import { createAction } from 'redux-actions';

import { RECEIVE_ENTITIES, DELETE_ENTITY, ADD_ENTITY, UPDATE_ENTITY } from '../constants';

export const receiveEntities = createAction(RECEIVE_ENTITIES); //eslint-disable-line
export const deleteEntity = createAction(DELETE_ENTITY);
export const addEntity = createAction(ADD_ENTITY);
export const updateEntity = createAction(UPDATE_ENTITY);
