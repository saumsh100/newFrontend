import { createAction } from 'redux-actions';
import {
  PREVIEW_SEGMENT_ATTEMPT,
  PREVIEW_SEGMENT_SUCCESS,
  PREVIEW_SEGMENT_ERROR,
  SEGMENTS_FETCH_CITIES_ATTEMPT,
  SEGMENTS_FETCH_CITIES_ERROR,
  SEGMENTS_FETCH_CITIES_SUCCESS,
} from '../constants';

export const previewSegmentAttempt = createAction(PREVIEW_SEGMENT_ATTEMPT);
export const previewSegmentSuccess = createAction(PREVIEW_SEGMENT_SUCCESS);
export const previewSegmentError = createAction(PREVIEW_SEGMENT_ERROR);

export const fetchCitiesAttempt = createAction(SEGMENTS_FETCH_CITIES_ATTEMPT);
export const fetchCitiesSuccess = createAction(SEGMENTS_FETCH_CITIES_SUCCESS);
export const fetchCitiesError = createAction(SEGMENTS_FETCH_CITIES_ERROR);

