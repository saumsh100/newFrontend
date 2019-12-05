
import storeFactory from './factory';
import rootReducer, { createInitialState } from '../reducers/reviewsReducer';

export default function configure({ initialState }) {
  const store = storeFactory({
    initialState: createInitialState(initialState),
    rootReducer,
  });

  if (module.hot) {
    module.hot.accept('../reducers/reviewsReducer', () => {
      const nextReducer = require('../reducers/reviewsReducer').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
