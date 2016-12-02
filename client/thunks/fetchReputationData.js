
import { fetchReputationStart, fetchReputationSuccess } from '../actions/reputation';

export default function fetchReputation () {
  return function(dispatch) {
    dispatch(fetchReputationStart())
    return fetch('/api/reputation', {
    }).then(response => response.json())
    .then(data => dispatch(fetchReputationSuccess(data)))
  }
};

