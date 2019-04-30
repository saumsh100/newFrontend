
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';

const DayRangeInput = ({
  placeholder,
  name,
  isActive,
  refCallback,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  onClick,
}) => (
  <input
    type="text"
    className={classnames(styles.dateInput, {
      [styles.active]: isActive,
    })}
    name={name}
    defaultValue={defaultValue}
    onChange={onChange}
    onFocus={onFocus}
    placeholder={placeholder}
    onBlur={onBlur}
    onClick={onClick}
    ref={refCallback}
  />
);

DayRangeInput.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  refCallback: PropTypes.func.isRequired,
};

DayRangeInput.defaultProps = {
  placeholder: '',
};

export default DayRangeInput;
