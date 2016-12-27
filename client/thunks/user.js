import { push } from 'react-router-redux';
import axios from 'axios';

export function changePassword(params) {
  return function (dispatch) {
    return axios
    .put('/api/users/changePassword', params)
    .then(({ data }) => {
      console.log(data);
      // set data in local storage
      console.log(data);
      dispatch(push('/'));
    });
  };
}
