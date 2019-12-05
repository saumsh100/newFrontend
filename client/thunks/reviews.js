
import { push } from 'connected-react-router';
import {
  setReview,
  setIsLoadingSentReview,
  mergeReviewValues,
  mergeSentReviewValues,
} from '../reducers/reviewsWidget';
import { bookingWidgetHttpClient } from '../util/httpClient';

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
    return bookingWidgetHttpClient()
      .post(`/reviews/${accountId}`, values)
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
    const sentReviewId = reviews.getIn(['sentReview', 'id']);
    const review = reviews.get('review');

    let savedReview = review;
    if (review.get('stars') >= 4) {
      // We don't allow descriptions for > 4 stars, better to remove here so we don't
      // wipe the form value, forcing them to re-input
      savedReview = review.set('description', null);
    }

    return bookingWidgetHttpClient()
      .post(`/reviews/${accountId}/${sentReviewId}`, savedReview.toJS())
      .then(({ data }) =>
        // No normalizr structure here
        dispatch(setReview(data)));
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
    return bookingWidgetHttpClient()
      .put(`/reviews/${reviewId}`, reviewData)
      .then(({ data }) => {
        // No normalizr structure here
        dispatch(setReview(data));
      });
  };
}

/**
 * loadSentReview will load the sentReview so that we can properly route to
 * completed if the sentReview is completed
 *
 * @returns {Function}
 */
export function loadSentReview() {
  return function (dispatch, getState) {
    dispatch(setIsLoadingSentReview(true));

    const { reviews } = getState();
    const sentReviewId = reviews.getIn(['sentReview', 'id']);

    // TODO: is it okay to just open up
    return bookingWidgetHttpClient()
      .get(`/sentReviews/${sentReviewId}`)
      .then(({ data }) => {
        if (data.sentReview.isCompleted) {
          dispatch(mergeReviewValues(data.review));
          dispatch(mergeSentReviewValues(data.sentReview));
          dispatch(push('./review/complete'));
        }

        dispatch(setIsLoadingSentReview(false));
      })
      .catch((err) => {
        console.error(err);
        dispatch(setIsLoadingSentReview(false));
      });
  };
}
