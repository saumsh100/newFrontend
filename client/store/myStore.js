
import storeFactory from './factory';
import rootReducer, { createInitialState } from '../reducers/myReducer';

export default function configure({ initialState } = {}) {
  const store = storeFactory({
    initialState: createInitialState(initialState),
    rootReducer,
  });

  if (module.hot) {
    module.hot.accept('../reducers/myReducer', () => {
      const nextReducer = require('../reducers/myReducer').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
