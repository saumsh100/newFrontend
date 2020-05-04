
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { enableBatching } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';
import LogRocket from 'logrocket';
import { isHub } from '../util/hub';

/**
 * History singleton object
 *
 * @type {
 *  {createHref, goBack, length, replace, go, action, location, goForward, block, push, listen}
 * }
 */
export const browserHistory = isHub() ? createMemoryHistory() : createBrowserHistory();

/**
 * Returns a store instance base on the state and rootReducer
 *
 * @param initialState
 * @param browserHistory
 * @param rootReducer
 * @param enableBatchingMode
 * @return {Store<S & {}, AnyAction> & {dispatch: unknown}}
 */
export default ({ initialState = {}, rootReducer, enableBatchingMode = true }) =>
  createStore(
    enableBatchingMode ? enableBatching(rootReducer(browserHistory)) : rootReducer(browserHistory),
    initialState,
    composeWithDevTools({ trace: true })(
      applyMiddleware(
        routerMiddleware(browserHistory),
        thunkMiddleware,
        LogRocket.reduxMiddleware(),
      ),
    ),
  );
