import { createAction } from 'redux-actions';
import {
  SET_SERVICE_ID,
  SET_PRACTITIONER_ID,
} from '../constants';

export const setServiceId = createAction(SET_SERVICE_ID);
export const setPractitionerId = createAction(SET_PRACTITIONER_ID);

