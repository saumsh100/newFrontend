
import { fetchReviewsStart, fetchReviewsSuccess } from '../actions/reviews';
import { httpClient } from '../util/httpClient';

export default function fetchReviews() {
  return function (dispatch) {
    dispatch(fetchReviewsStart());
    return httpClient()
      .get('/api/reputation/reviews')
      .then(data => dispatch(fetchReviewsSuccess(data.data)));
  };
}
