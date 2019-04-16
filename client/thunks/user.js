
import { SubmissionError } from 'redux-form';
import { showAlertTimeout } from './alerts';
import { httpClient } from '../util/httpClient';

// TODO: remove UX specific logic from here, just return request promise...
// eslint-disable-next-line import/prefer-default-export
export function changePassword(params) {
  return function (dispatch, getState) {
    const id = getState().auth.getIn(['user', 'id']);
    return httpClient()
      .put(`/api/users/${id}`, params)
      .then(() => {
        // re-route?
        // dispatch(push('/'));
        dispatch(
          showAlertTimeout({
            alert: { body: 'Password Changed' },
            type: 'success',
          }),
        );
      })
      .catch((err) => {
        dispatch(showAlertTimeout({ alert: { body: err.data },
          type: 'error' }));
        throw new SubmissionError({
          oldPassword: err.data,
        });
      });
  };
}
