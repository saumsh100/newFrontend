
import axios from 'axios';
import {
  setReview,
} from '../reducers/reviewsWidget';

/**
 * createReview will post to the API to create the review instance
 * and set it in state
 *
 * @param values
 * @returns {Function}
 */
export function createReview(values) {
  return function (dispatch, getState) {
    // TODO: we should be able to know if this is coming from a SentReview
    // TODO: vs. organic so that we can add the relation (mark SentReview as successful)
    const { reviews } = getState();
    const accountId = reviews.getIn(['account', 'id']);
    return axios.post(`/reviews/${accountId}`, values)
      .then(({ data }) => {
        // No normalizr structure here
        dispatch(setReview(data));
      });
  };
}

/**
 * createReview will post to the API to create the review instance
 * and set it in state
 *
 * @param values
 * @returns {Function}
 */
export function saveReview() {
  return function (dispatch, getState) {
    const { reviews } = getState();
    const accountId = reviews.getIn(['account', 'id']);
    const review = reviews.get('review');
    const sentReviewId = review.get('sentReviewId');

    let savedReview = review;
    if (review.get('stars') >= 4) {
      // We don't allow descriptions for > 4 stars, better to remove here so we don't
      // wipe the form value, forcing them to re-input
      savedReview = review.set('description', null);
    }

    return axios.post(`/reviews/${accountId}/${sentReviewId}`, savedReview.toJS())
      .then(({ data }) => {
        // No normalizr structure here
        return dispatch(setReview(data));
      });
  };
}

/**
 * updateReview will add the currently logged in patientUserId
 * to the review so that we can now associate a user with it
 *
 * @returns {Function}
 */
export function updateReview() {
  return function (dispatch, getState) {
    const { auth, reviews } = getState();
    const reviewId = reviews.getIn(['review', 'id']);
    const patientUserId = auth.getIn(['patientUser', 'id']);
    const reviewData = { patientUserId };
    return axios.put(`/reviews/${reviewId}`, reviewData)
      .then(({ data }) => {
        // No normalizr structure here
        dispatch(setReview(data));
      });
  };
}