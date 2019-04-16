
import { fetchReputationStart, fetchReputationSuccess } from '../actions/reputation';
import { httpClient } from '../util/httpClient';

export default function fetchReputation() {
  return function (dispatch) {
    dispatch(fetchReputationStart());
    return httpClient()
      .get('/api/reputation/listings')
      .then(data => dispatch(fetchReputationSuccess(data)));
  };
}
