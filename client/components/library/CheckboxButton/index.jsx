
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

export default function CheckboxButton(props) {
  const {
    id,
    label,
    checked,
    onChange,
    value,
    labelStyles,
  } = props;

  // Pass in a className with a set width property

  let labelClasses = styles.buttonLabel;

  if (labelStyles) {
    labelClasses = classNames(labelClasses, labelStyles);
  }

  return (
    <div className={styles.checkboxButton}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        value={value}
        onChange={() => {}}
      />
      <label
        className={labelClasses}
        htmlFor={id}
        onClick={onChange}
        onChange={onChange}
      >
        {label}
      </label>
    </div>
  );
}

CheckboxButton.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  labelStyles: PropTypes.object,
};
