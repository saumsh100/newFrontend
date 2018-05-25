
import PropTypes from 'prop-types';

export const metaShape = {
  active: PropTypes.bool,
  asyncValidating: PropTypes.bool,
  autofilled: PropTypes.bool,
  dirty: PropTypes.bool,
  dispatch: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  form: PropTypes.string,
  initial: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  invalid: PropTypes.bool,
  pristine: PropTypes.bool,
  submitFailed: PropTypes.bool,
  submitting: PropTypes.bool,
  touched: PropTypes.bool,
  valid: PropTypes.bool,
  visited: PropTypes.bool,
  warning: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export const inputShape = {
  name: PropTypes.string,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onDragStart: PropTypes.func,
  onDrop: PropTypes.func,
  onFocus: PropTypes.func,
};
