
import { showAlert, hideAlert } from '../actions/alerts';

export function showAlertTimeout(payload) {
  return (dispatch, getState) => {
    dispatch(showAlert(payload));
    const { alerts } = getState();
    const length = alerts.toJS().alertsStack.length;
    const alertsStack = alerts.toJS().alertsStack;

    //const time = alertsStack[length - 1].time;
    alertsStack.map((alrt, index) => {
      window.setTimeout(() => {
        dispatch(hideAlert({ index }));
      }, alrt.time);
    })
  };
}
