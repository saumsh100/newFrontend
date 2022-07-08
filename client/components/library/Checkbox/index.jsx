import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames/bind';
import withTheme from '../../../hocs/withTheme';
import styles from './reskin-styles.scss';

const Checkbox = ({
  id,
  value,
  label,
  onChange,
  hidden,
  labelClassNames,
  theme,
  customContainer,
  showIndeterminate,
  className,
  checked,
}) => {
  checked = typeof checked === 'string' ? checked === 'true' : checked;

  const labelClasses = classNames(theme.label, {
    [labelClassNames]: labelClassNames,
  });

  const classes = classNames(theme.cbx, {
    [theme.cbxChecked]: checked,
    [theme.cbxIndeterminate]: showIndeterminate,
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
    <div className={`${containerClasses} ${className}`}>
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
          checked={!!checked}
          value={value}
          onChange={() => {}}
          className={classes}
        />
        <span />
      </div>
      <span
        onClick={onChange}
        role="button"
        onKeyDown={onKeyDown}
        tabIndex="0"
        onChange={onChange}
        className={labelClasses}
      >
        {label}
      </span>
    </div>
  );
};

Checkbox.propTypes = {
  customContainer: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  showIndeterminate: PropTypes.bool,
  theme: PropTypes.objectOf(PropTypes.string),
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  hidden: PropTypes.bool,
  labelClassNames: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
};

Checkbox.defaultProps = {
  customContainer: null,
  id: '',
  label: '',
  hidden: false,
  showIndeterminate: false,
  theme: {},
  labelClassNames: '',
  value: '',
  checked: false,
  className: '',
};

export default withTheme(Checkbox, styles);
