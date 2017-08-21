
import { showAlert, hideAlert } from '../actions/alerts';

export function showAlertTimeout(payload) {
  return (dispatch, getState) => {
    dispatch(showAlert(payload));

    const { alerts } = getState();
    const alertsStack = alerts.toJS().alertsStack;

    alertsStack.map((alrt) => {
      if (alrt && !alrt.sticky) {
        window.setTimeout(() => {
          dispatch(hideAlert({ alert: alrt }));
        }, alrt.time);
      }
    });
  };
}
