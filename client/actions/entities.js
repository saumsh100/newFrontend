
import { createAction } from 'redux-actions';

import { RECEIVE_ENTITIES, DELETE_ENTITY } from '../constants';

export const receiveEntities = createAction(RECEIVE_ENTITIES); //eslint-disable-line
export const deleteEntity = createAction(DELETE_ENTITY);
