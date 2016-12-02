
import { createAction } from 'redux-actions';
import {
  FETCH_REVIEWS,
  FETCH_REVIEWS_SUCCESS,
} from '../constants';

export const fetchReviewsStart = createAction(FETCH_REVIEWS);
export const fetchReviewsSuccess = createAction(FETCH_REVIEWS_SUCCESS);
