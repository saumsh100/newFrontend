
import storeFactory from './factory';
import rootReducer from '../reducers';

export default function configure({ initialState } = {}) {
  const store = storeFactory({
    initialState,
    rootReducer,
  });

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
