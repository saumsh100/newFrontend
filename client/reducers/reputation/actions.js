import {
  FETCH_REPUTATION,
  FETCH_REPUTATION_SUCCESS,
  REPUTATION_URL
} from './constants'

// TODO use fetch after access control is allowed, or proxy through node
// export function fetchReputation (dispatch) {
//   return function() {
//     return fetch(REPUTATION_URL, {
//       method: 'POST',
//       body: JSON.stringify({
//         customerIdentifier: "UNIQUE_CUSTOMER_IDENTIFIER"
//       }),
//       mode: 'cors'
//     }).then(response => response.json())
//     .then(data => dispatch(fetchReputationSuccess(data)))
//   }
// };


export function fetchReputation (dispatch) {
  return function() {
    return setTimeout(() => (dispatch(fetchReputationSuccess({
      "version": "2.0",
      "data": {
        "sourcesNotFound": 16,
        "sourcesFound": 2,
        "listingScore": 12,
        "listingPointScore": {
          "industryAverage": 398,
          "industryLeadersAverage": 679,
          "pointScore": 217
        },
        "citationsFound": 18,
        "sourcesFoundWithErrors": 2,
        "accuracyScore": 6.6001165234374994
      },
      "requestId": "",
      "responseTime": 1544,
      "statusCode": 200
    }))), 1000)
  }
};



function fetchReputationSuccess(data) {
  return {
    type: FETCH_REPUTATION_SUCCESS,
    data: data.data
  }
}