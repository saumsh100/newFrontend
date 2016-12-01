
import { createAction } from 'redux-actions';
import {
  FETCH_REPUTATION_SUCCESS,
} from '../constants';

export const fetchReputationSuccess = createAction(FETCH_REPUTATION_SUCCESS);
