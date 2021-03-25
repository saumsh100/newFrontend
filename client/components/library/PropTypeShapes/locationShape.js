
import PropTypes from 'prop-types';

const locationShape = {
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  state: PropTypes.any,
  key: PropTypes.string,
};

export default locationShape;
