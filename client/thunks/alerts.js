
import { showAlert, hideAlert } from '../actions/alerts';

export function showAlertTimeout(payload, time) {
  const waitTime = time || 3000;
  return (dispatch) => {
    dispatch(showAlert(payload));
    window.setTimeout(() => {
      dispatch(hideAlert(payload));
    }, waitTime);
  };
}
