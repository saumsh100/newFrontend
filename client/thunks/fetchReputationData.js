
import axios from './axios';
import { fetchReputationStart, fetchReputationSuccess } from '../actions/reputation';

export default function fetchReputation() {
  return function (dispatch) {
    dispatch(fetchReputationStart());
    return axios.get('/api/reputation/listings')
    .then(data => dispatch(fetchReputationSuccess(data)));
  };
}
