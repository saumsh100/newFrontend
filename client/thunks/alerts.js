
import { createAlert, removeAlert } from '../actions/alerts';

export function showAlertTimeout(payload) {
  return (dispatch, getState) => {
    dispatch(createAlert(payload));

    if (payload.alert.browserAlert) {
      notify(payload.alert, payload.type);
    }

    const alerts = getState().alerts;

    alerts.toArray().map((alert) => {
      if (alert && !alert.get('sticky')) {
        window.setTimeout(() => {
          dispatch(removeAlert({alert}));
        }, alert.time);
      }
    });
  };
}


function notify(alert, type) {
  let title = alert.title;

  if (!title && type === 'success') {
    title = 'Success';
  } else if (type === 'error' && !title) {
    title = 'Error';
  }

  const options = {
    body: alert.body,
  };

  // Let's check whether notification permissions have already been granted
  if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    return new Notification(title, options);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        return new Notification(title, options);
      }
    });
  }

  return null;
}
