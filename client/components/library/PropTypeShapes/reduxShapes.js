
import PropTypes from 'prop-types';

const storeShape = {
  dispatch: PropTypes.func,
  getState: PropTypes.func,
  liftedStore: PropTypes.shape({
    dispatch: PropTypes.func,
    getState: PropTypes.func,
    replaceReducer: PropTypes.func,
    subscribe: PropTypes.func,
  }),
  replaceReducer: PropTypes.func,
  subscribe: PropTypes.func,
};

export default storeShape;
