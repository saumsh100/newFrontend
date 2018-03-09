
import { createAlert, removeAlert } from '../actions/alerts';

export function showAlertTimeout(payload) {
  return (dispatch, getState) => {
    dispatch(createAlert(payload));

    const alerts = getState().alerts ? getState().alerts.toArray() : [];

    alerts.map((alert) => {
      if (alert && !alert.get('sticky')) {
        window.setTimeout(() => {
          dispatch(removeAlert({alert}));
        }, alert.time);
      }
    });
  };
}
