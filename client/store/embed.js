
/* eslint global-require:0 */
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
// import thunkMiddleware from 'redux-thunk';
// import { logger } from '../middleware';
import embedReducer from '../reducers/embed';

export default function configure({ initialState, rootSaga }) {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;

  const sagaMiddleware = createSagaMiddleware();

  const createStoreWithMiddleware = applyMiddleware(
    //routerMiddleware(browserHistory),
    //sagaMiddleware
  )(create);

  const store = createStoreWithMiddleware(embedReducer, initialState);

  if (rootSaga) {
    sagaMiddleware.run(rootSaga);
  }

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });

    // Hot loading is currently not supported in sagas.
    // module.hot.accept('../sagas', () => {
    //   const nextSaga = require('../sagas').default;
    //   sagaMiddleware.run(nextSaga);
    // });
  }

  return store;
}
