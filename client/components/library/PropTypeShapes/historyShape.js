
import PropTypes from 'prop-types';

import locationShape from './locationShape';

const historyShape = {
  length: PropTypes.number.isRequired,
  action: PropTypes.string.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  index: PropTypes.number,
  entries: PropTypes.arrayOf(PropTypes.shape(locationShape)),
  createHref: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  go: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  canGo: PropTypes.func,
  block: PropTypes.func.isRequired,
  listen: PropTypes.func.isRequired,
};

export default historyShape;
