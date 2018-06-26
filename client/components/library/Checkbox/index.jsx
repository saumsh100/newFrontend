
import React, { PropTypes, Component, defaultProps } from 'react';
import classNames from 'classnames/bind';
import withTheme from '../../../hocs/withTheme';
import styles from './styles.scss';

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
    customContainer,
  } = props;

  const labelClasses = classNames(theme.label, {
    [labelClassNames]: labelClassNames,
  });

  const classes = classNames(theme.cbx, {
    [theme.cbxChecked]: checked,
  });

  const containerClasses = classNames(theme.cbxContainer, {
    [styles.hidden]: hidden,
    [customContainer]: customContainer,
  });

  const onKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      onChange(e);
    }
  };

  return (
    <div className={containerClasses}>
      <div
        className={classes}
        onClick={onChange}
        onChange={onChange}
        role="button"
        onKeyDown={onKeyDown}
        tabIndex="0"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          value={value}
          onChange={() => {}}
          className={classes}
        />
        <label htmlFor={id} />
      </div>
      <span onClick={onChange} onChange={onChange} className={labelClasses}>
        {label}
      </span>
    </div>
  );
}

Checkbox.propTypes = {
  customContainer: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  // checked: PropTypes.bool,
};

Checkbox.defaultProps = {
  customContainer: null,
};

export default withTheme(Checkbox, styles);
