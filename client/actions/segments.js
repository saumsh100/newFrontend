import { createAction } from 'redux-actions';
import {
  PREVIEW_SEGMENT_ATTEMPT,
  PREVIEW_SEGMENT_SUCCESS,
  PREVIEW_SEGMENT_ERROR,
  SEGMENTS_FETCH_CITIES_ATTEMPT,
  SEGMENTS_FETCH_CITIES_ERROR,
  SEGMENTS_FETCH_CITIES_SUCCESS,
  SEGMENT_APPLY,
  SEGMENT_REMOVE_APPLIED,
  SEGMENT_SET_NAME,
} from '../constants';

export const previewSegmentAttempt = createAction(PREVIEW_SEGMENT_ATTEMPT);
export const previewSegmentSuccess = createAction(PREVIEW_SEGMENT_SUCCESS);
export const previewSegmentError = createAction(PREVIEW_SEGMENT_ERROR);

export const fetchCitiesAttempt = createAction(SEGMENTS_FETCH_CITIES_ATTEMPT);
export const fetchCitiesSuccess = createAction(SEGMENTS_FETCH_CITIES_SUCCESS);
export const fetchCitiesError = createAction(SEGMENTS_FETCH_CITIES_ERROR);

export const applySegment = createAction(SEGMENT_APPLY);
export const removeApplied = createAction(SEGMENT_REMOVE_APPLIED);
export const setName = createAction(SEGMENT_SET_NAME);
