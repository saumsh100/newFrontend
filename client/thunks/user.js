import axios from 'axios';
import { SubmissionError } from 'redux-form';

// TODO: remove UX specific logic from here, just return request promise...
export function changePassword(params) {
  return function (dispatch, getState) {
    const id = getState().auth.getIn(['user', 'id']);
    return axios
      .put(`/api/users/${id}`, params)
      .then(() => {
        // re-route?
        // dispatch(push('/'));
      })
      .catch((err) => {
        throw new SubmissionError({
          confirmPassword: err.data,
        });
      });
  };
}
