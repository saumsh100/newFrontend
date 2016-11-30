
/* eslint global-require:0 */
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

export default function configure({ initialState, browserHistory, rootSaga }) {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;
  
  const createStoreWithMiddleware = applyMiddleware(
    routerMiddleware(browserHistory),
    thunk
  )(create);
  
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });
  }
  
  return store;
}
