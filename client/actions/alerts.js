
import { batchActions } from 'redux-batched-actions';
const SHOW_ALERT = 'SHOW_ALERT';
const HIDE_ALERT = 'HIDE_ALERT';

export function showAlert(payload) {
  return {
    type: SHOW_ALERT,
    alert: {
      text: payload.text,
      type: payload.type,
    },
  };
};

export function hideAlert(payload) {
  return {
    type: HIDE_ALERT,
  };
};

export function showAlertTimeout(payload) {
  return dispatch => {
    dispatch({
      type: SHOW_ALERT,
      alert: {
        text: payload.text,
        type: payload.type,
      },
    });
   window.setTimeout(() =>{
      dispatch({
        type: HIDE_ALERT,
      });
    }, 3000);
  };
}
