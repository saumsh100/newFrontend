
import axios from 'axios';
import { previewSegmentAttempt, previewSegmentError, previewSegmentSuccess } from '../actions/segments';

export function previewSegment(rawWhere) {
  return function (dispatch, getState) {
    const data = new FormData();
    data.append('rawWhere', JSON.stringify(rawWhere));
    dispatch(previewSegmentAttempt());
    return axios
      .post('/_api/segments/preview', data)
      .then(
        (response) => {
          dispatch(previewSegmentSuccess({ payload: response }));
        },
        (error) => {
          dispatch(previewSegmentError({ payload: error }));
        }
      );
  };
}
