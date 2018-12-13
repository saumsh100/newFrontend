
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from '../Button';
import styles from './styles.scss';

const CheckboxButton = ({
  id,
  label,
  checked,
  onChange,
  value,
  labelStyles,
  wrapperStyle,
  ...props
}) => (
  <div
    className={classNames(styles.checkboxButton, { [wrapperStyle]: wrapperStyle })}
    data-test-id={props['data-test-id']}
  >
    <input type="checkbox" id={id} checked={checked} value={value} onChange={() => {}} />
    <Button
      className={classNames(styles.buttonLabel, { [labelStyles]: labelStyles })}
      onClick={onChange}
      onChange={onChange}
    >
      {label}
    </Button>
  </div>
);

CheckboxButton.propTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  labelStyles: PropTypes.string,
  wrapperStyle: PropTypes.string,
  label: PropTypes.string.isRequired,
  'data-test-id': PropTypes.string,
};

CheckboxButton.defaultProps = {
  id: '',
  value: '',
  wrapperStyle: '',
  checked: false,
  labelStyles: '',
  'data-test-id': '',
};

export default CheckboxButton;
