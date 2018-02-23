
import React, { PropTypes, Component, defaultProps } from 'react';
import classNames from 'classnames/bind';
import withTheme from '../../../hocs/withTheme';
import styles from './styles.scss';

const cx = classNames.bind(styles);

function Checkbox(props) {
  const {
    id,
    value,
    label,
    checked,
    onChange,
    hidden,
    labelClassNames,
    theme,
  } = props;

  let classes = theme.cbx;
  let containerClasses = theme.cbxContainer;

  let labelClasses = theme.label;

  if (labelClassNames) {
    labelClasses = classNames(labelClasses, labelClassNames);
  }

  if (checked) {
    classes = classNames(classes, theme.cbxChecked);
  }

  if (hidden) {
    containerClasses = classNames(containerClasses, styles.hidden);
  }

  return (
    <div className={containerClasses}>
      <div
        className={classes}
        onClick={onChange}
        onChange={onChange}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          value={value}
          onChange={() => {}}
          className={classes}
        />
        <label
          htmlFor={id}

        />
      </div>
      <span
        onClick={onChange}
        onChange={onChange}
        className={labelClasses}
      >{label}</span>
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  // checked: PropTypes.bool,
};

export default withTheme(Checkbox, styles);
