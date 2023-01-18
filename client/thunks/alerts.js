/* eslint-disable import/prefer-default-export */
import { v4 as uuid } from 'uuid';
import { createAlert, removeAlert } from '../reducers/alerts';
import Alert from '../entities/models/Alert';
import DesktopNotification from '../util/desktopNotification';

function checkExistAlert(payload, alertList) {
  const { alert = {} } = payload;
  if (alert && alert.body) {
    return alertList.some((alertListItem) => alertListItem?.get('body') === alert.body);
  }
  return false;
}

const generateAlert = ({ alert, type }) => {
  const title = alert.title || (type === 'success' ? 'Success' : 'Error');
  const id = alert.id || uuid();
  const alertData = new Alert({
    id,
    title,
    body: alert.body,
    subText: alert.subText || '',
    type,
    caller: alert.caller || false,
    time: 3000,
    sticky: alert.sticky || false,
    browserAlert: alert.browserAlert || false,
    clickable: alert.clickable || false,
  });

  if (alert.browserAlert) {
    DesktopNotification.showNotification(title, { body: alert.body });
  }
  return alertData;
};

export function showAlertTimeout(payload) {
  return (dispatch, getState) => {
    const alerts = getState().alerts ? getState().alerts.toArray() : [];
    const hasAlertDisplayed = checkExistAlert(payload, alerts);

    const newAlert = generateAlert(payload);
    if (!hasAlertDisplayed) {
      dispatch(createAlert(newAlert));
    }

    [...alerts, newAlert].forEach((alert) => {
      if (alert && !alert.get('sticky')) {
        window.setTimeout(() => {
          dispatch(removeAlert({ alert }));
        }, alert.time);
      }
    });
  };
}
