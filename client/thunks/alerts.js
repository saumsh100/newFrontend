
import { createAlert, removeAlert } from '../actions/alerts';

export function showAlertTimeout(payload) {
  return (dispatch, getState) => {
    dispatch(createAlert(payload));

    const alerts = getState().alerts;

    alerts.toArray().map((alert) => {
      if (alert && !alert.get('sticky')) {
        window.setTimeout(() => {
          dispatch(removeAlert({ alert }));
        }, alert.time);
      }
    });
  };
}
