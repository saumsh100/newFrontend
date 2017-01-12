
import axios from 'axios';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form';

// TODO: remove UX specific logic from here, just return request promise...
export function changePassword(params) {
  return function (dispatch, getState) {
    const id = getState().auth.getIn(['user', 'id']);
    alert('Making request to change passwords');
    return axios
      .put(`/api/users/${id}`, params)
      .then(() => {
        // re-route?
        // dispatch(push('/'));
        alert('Password changed!');
      })
      .catch((err) => {
        throw new SubmissionError({
          confirmPassword: err.data,
        });
      });
  };
}
