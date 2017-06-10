
import { batchActions } from 'redux-batched-actions';
// TODO: I said to put these constants and the actions in the reducer for alerts
// TODO: It is the structure we will be going with in the future
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
}

export function hideAlert(payload) {
  return {
    type: HIDE_ALERT,
  };
}


// TODO: why is the thunk here?
export function showAlertTimeout(payload) {
  return dispatch => {
    // TODO: not dispatch(showAction(data)) ?
    dispatch({
      type: SHOW_ALERT,
      alert: {
        text: payload.text,
        type: payload.type,
      },
    });

    /*window.setTimeout(() =>{
      // TODO: not dispatch(hideAction()) ?
      dispatch({
        type: HIDE_ALERT,
      });
    }, 3000);*/
  };
}
