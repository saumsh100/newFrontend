
import React, { PropTypes, Component, defaultProps } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.scss';

const cx = classNames.bind(styles);

export default function Checkbox(props) {
  const {
    id,
    value,
    label,
    checked,
    onChange,
    hidden,
    labelClassNames,
  } = props;

  const classes = classNames(
    props.className,
    cx({
      checkbox: true,
      hidden,
    })
  );

  let labelClasses = styles.checkbox;

  if (labelClassNames) {
    labelClasses = classNames(labelClasses, labelClassNames);
  }

  return (
    <div className={classes} >
      <input
        className={styles.checkbox__input}
        type="checkbox"
        id={id}
        checked={checked}
        value={value}
        onChange={() => {}}
      />
      <label
        htmlFor={id}
        className={labelClasses}
        onClick={onChange}
        onChange={onChange}
      >
        {label}
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  // checked: PropTypes.bool,
};
