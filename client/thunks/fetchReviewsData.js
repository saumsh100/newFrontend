import axios from './axios';
import { fetchReviewsStart, fetchReviewsSuccess } from '../actions/reviews';

export default function fetchReviews() {
  return function (dispatch) {
    dispatch(fetchReviewsStart());
    return axios.get('/api/reputation/reviews')
    .then(data => dispatch(fetchReviewsSuccess(data)));
  };
}

