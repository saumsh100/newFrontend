
import {
  previewSegmentAttempt,
  previewSegmentError,
  previewSegmentSuccess,
  fetchCitiesAttempt,
  fetchCitiesError,
  fetchCitiesSuccess,
} from '../actions/segments';
import { httpClient } from '../util/httpClient';

export function previewSegment(rawWhere) {
  return function (dispatch) {
    const data = new FormData();
    data.append('rawWhere', JSON.stringify(rawWhere));
    dispatch(previewSegmentAttempt());
    return httpClient()
      .post('/api/segments/preview', { rawWhere })
      .then(
        (response) => {
          dispatch(previewSegmentSuccess(response.data));
        },
        (error) => {
          dispatch(previewSegmentError(new Error(error)));
        },
      );
  };
}

export function fetchCities(enterpriseId) {
  return function (dispatch) {
    dispatch(fetchCitiesAttempt());
    return httpClient()
      .get(`/api/enterprises/${enterpriseId}/accounts/cities`)
      .then(
        (response) => {
          dispatch(fetchCitiesSuccess(response.data));
        },
        (error) => {
          dispatch(fetchCitiesError(new Error(error)));
        },
      );
  };
}
