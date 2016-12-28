import { push } from 'react-router-redux';
import axios from 'axios';

export function changePassword(params) {
  return function (dispatch, getState) {
    const id = getState().auth.toJS().user.id;
    console.log(id);
    return axios
      .put(`/api/users/${id}`, params)
      .then(() => {
        dispatch(push('/'));
      });
  };
}
