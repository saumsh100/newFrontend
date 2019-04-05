
import axios from 'axios';
import {
  previewSegmentAttempt,
  previewSegmentError,
  previewSegmentSuccess,
  fetchCitiesAttempt,
  fetchCitiesError,
  fetchCitiesSuccess,
} from '../actions/segments';

export function previewSegment(rawWhere) {
  return function (dispatch) {
    const data = new FormData();
    data.append('rawWhere', JSON.stringify(rawWhere));
    dispatch(previewSegmentAttempt());
    return axios.post('/api/segments/preview', { rawWhere }).then(
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
    return axios.get(`/api/enterprises/${enterpriseId}/accounts/cities`).then(
      (response) => {
        dispatch(fetchCitiesSuccess(response.data));
      },
      (error) => {
        dispatch(fetchCitiesError(new Error(error)));
      },
    );
  };
}
