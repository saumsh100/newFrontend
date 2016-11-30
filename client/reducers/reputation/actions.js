import {
  FETCH_REPUTATION,
  FETCH_REPUTATION_SUCCESS,
  REPUTATION_URL
} from './constants'

export function fetchReputation(id) {
  return function (dispatch) {
    return fetch(REPUTATION_URL)
      .then(data => dispatch(fetchReputationSuccess(data)))
  };
}

fetchReputationSuccess(data) {
  return {
    type: FETCH_REPUTATION_SUCCESS,
    data: data
  }
}