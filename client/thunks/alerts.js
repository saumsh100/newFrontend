
import { showAlert, hideAlert } from '../actions/alerts';

export function showAlertTimeout(payload) {
  return (dispatch, getState) => {
    dispatch(showAlert(payload));
    const alerts = getState().alerts;
    alerts.toArray().map((alert) => {
      if (alert && !alert.get('sticky')) {
        window.setTimeout(() => {
          dispatch(hideAlert({ alert }));
        }, alert.time);
      }
    });
  };
}
