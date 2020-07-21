
import { SubmissionError } from 'redux-form';
import { showAlertTimeout } from './alerts';
import { httpClient } from '../util/httpClient';

// TODO: remove UX specific logic from here, just return request promise...
// eslint-disable-next-line import/prefer-default-export
export const changePassword = params => async (dispatch, getState) => {
  const id = getState().auth.getIn(['user', 'id']);
  try {
    const res = await httpClient().put(`/api/users/${id}`, params);
    if (res) {
      dispatch(
        showAlertTimeout({
          alert: { body: 'Password Changed' },
          type: 'success',
        }),
      );
    }
  } catch (error) {
    const { body } = error.response.data;
    const field = 'oldPassword';
    dispatch(
      showAlertTimeout({
        alert: { body },
        type: 'error',
      }),
    );
    throw new SubmissionError({
      [field]: body,
    });
  }
};
