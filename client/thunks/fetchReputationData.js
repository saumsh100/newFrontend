
import { fetchReputationSuccess } from '../actions/reputation';

export default function fetchReputation () {
  return function(dispatch) {
    return fetch('/api/reputation', {
    }).then(response => response.json())
    .then(data => dispatch(fetchReputationSuccess(data)))
  }
};

