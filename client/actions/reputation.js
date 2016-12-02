
import { createAction } from 'redux-actions';
import {
  FETCH_REPUTATION,
  FETCH_REPUTATION_SUCCESS,
} from '../constants';

export const fetchReputationStart = createAction(FETCH_REPUTATION);
export const fetchReputationSuccess = createAction(FETCH_REPUTATION_SUCCESS);
