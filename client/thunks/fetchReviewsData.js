
import { fetchReviewsStart, fetchReviewsSuccess } from '../actions/reviews';

export default function fetchReviews () {
  return function(dispatch) {
    dispatch(fetchReviewsStart())
    return fetch('/api/reputation/reviews', {
    }).then(response => response.json())
    .then(data => dispatch(fetchReviewsSuccess(data)))
  }
};

