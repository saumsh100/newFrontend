import { createAction } from 'redux-actions';
import {
  PREVIEW_SEGMENT_ATTEMPT,
  PREVIEW_SEGMENT_SUCCESS,
  PREVIEW_SEGMENT_ERROR,
} from '../constants';

export const previewSegmentAttempt = createAction(PREVIEW_SEGMENT_ATTEMPT);
export const previewSegmentSuccess = createAction({ PREVIEW_SEGMENT_SUCCESS: data => data });
export const previewSegmentError = createAction(PREVIEW_SEGMENT_ERROR);

