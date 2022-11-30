/* eslint-disable import/prefer-default-export */
import { createAlert, removeAlert } from '../reducers/alerts';

function checkExistAlert(payload, alertList) {
  const { alert = {} } = payload;
  if (alert && alert.body) {
    return alertList.some((alertListItem) => alertListItem?.get('body') === alert.body);
  }
  return false;
}

export function showAlertTimeout(payload) {
  return (dispatch, getState) => {
    const alerts = getState().alerts ? getState().alerts.toArray() : [];

    const hasAlertDisplayed = checkExistAlert(payload, alerts);
    if (!hasAlertDisplayed) {
      dispatch(createAlert(payload));
    }

    alerts.map((alert) => {
      if (alert && !alert.get('sticky')) {
        window.setTimeout(() => {
          dispatch(removeAlert({ alert }));
        }, alert.time);
      }
      return null;
    });
  };
}
