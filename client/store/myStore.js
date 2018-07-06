
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { enableBatching } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';
import rootReducer, { createInitialState } from '../reducers/myReducer';

export default function configure({ initialState, browserHistory }) {
  const create = window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore;

  const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    routerMiddleware(browserHistory),
  )(create);

  const store = createStoreWithMiddleware(
    enableBatching(rootReducer),
    createInitialState(initialState),
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
