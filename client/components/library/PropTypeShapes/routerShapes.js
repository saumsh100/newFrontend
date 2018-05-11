
import PropTypes from 'prop-types';

export const locationShape = {
  hash: PropTypes.string.isRequired,
  key: PropTypes.string,
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  state: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
  ]),
};

export const historyShape = {
  length: PropTypes.number,
  action: PropTypes.string,
  location: PropTypes.shape(locationShape),
  index: PropTypes.number,
  entries: PropTypes.arrayOf(PropTypes.shape(locationShape)),
  createHref: PropTypes.func,
  push: PropTypes.func,
  replace: PropTypes.func,
  go: PropTypes.func,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  canGo: PropTypes.func,
  block: PropTypes.func,
  listen: PropTypes.func,
};
