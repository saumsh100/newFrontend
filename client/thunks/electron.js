
import { push } from 'connected-react-router';
import { electron } from '../util/ipc';
import { hideContent } from '../reducers/electron';
import { RESIZE_WINDOW } from '../constants';

export function displayContent(isExpensive = false) {
  return () => {
    electron.send(RESIZE_WINDOW, { expanded: true, isExpensive });
  };
}

export function collapseContent() {
  return (dispatch, getState) => {
    const { router } = getState();
    if (router.location.pathname.indexOf('/intercom') > -1) {
      window.Intercom('hide');
    }

    dispatch(hideContent());
    setTimeout(() => {
      dispatch(push('/'));
      electron.send(RESIZE_WINDOW, { expanded: false });
    }, 300);
  };
}

export function collapseWithoutResizing() {
  return (dispatch) => {
    dispatch(hideContent());
  };
}
