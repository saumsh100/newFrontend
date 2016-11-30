import {
  FETCH_REPUTATION,
  FETCH_REPUTATION_SUCCESS,
  REPUTATION_URL
} from './constants'

export function fetchReputation (dispatch) {
  return function() {
    return fetch(REPUTATION_URL, {
      method: 'POST',
      body: JSON.stringify({
        customerIdentifier: "UNIQUE_CUSTOMER_IDENTIFIER"
      }),
      mode: 'no-cors'
    }).then(data => dispatch(fetchReputationSuccess(data)))
  }
};

function fetchReputationSuccess(data) {
  return {
    type: FETCH_REPUTATION_SUCCESS,
    data: data
  }
}