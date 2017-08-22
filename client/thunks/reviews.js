
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
    console.log('values', values);
    const { reviews } = getState();
    const accountId = reviews.getIn(['account', 'id']);
    return axios.post(`/reviews/${accountId}`, values)
      .then(({ data }) => {
        //debugger;
        //const { entities } = data;
        //const reviewId = Object.keys(entities)[0];
        dispatch(setReview(data));
      });
  };
}
