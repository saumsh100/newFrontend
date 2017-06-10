import { showAlert, hideAlert } from '../actions/alerts';

export function showAlertTimeout(payload) {
  return dispatch => {
    dispatch(showAlert(payload));
    window.setTimeout(() =>{
      dispatch(hideAlert(payload));
    }, 3000);
  };
}
