
import { createAction } from 'redux-actions';

import {
	RECEIVE_ENTITIES,
	FETCH_MODEL,
	DELETE_ENTITY,
	ADD_ENTITY,
	UPDATE_ENTITY,
	SEND_MESSAGE_ON_CLIENT,
	READ_MESSAGES_IN_CURRENT_DIALOG,
	UPDATE_PATIENT_IN_PATIENT_LIST,
} from '../constants';

export const receiveEntities = createAction(RECEIVE_ENTITIES); //eslint-disable-line
export const fetchModel = createAction(FETCH_MODEL);
export const deleteEntity = createAction(DELETE_ENTITY);
export const addEntity = createAction(ADD_ENTITY);
export const updateEntity = createAction(UPDATE_ENTITY);
export const sendMessageOnClientAction = createAction(SEND_MESSAGE_ON_CLIENT);
export const readMessagesInCurrentDialogAction = createAction(READ_MESSAGES_IN_CURRENT_DIALOG);
export const updatePatientInPatientListAction = createAction(UPDATE_PATIENT_IN_PATIENT_LIST);