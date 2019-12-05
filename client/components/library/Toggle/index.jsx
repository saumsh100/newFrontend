
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RCToggle from 'react-toggle';
import { isHub } from '../../../util/hub';
import styles from './styles.scss';

const Toggle = ({
                  className, icons, color, theme, label, name,checked, ...props
                }) => {

  const classes = theme
    ? classNames(styles[`theme_${theme}Background`])
    : classNames(styles.toggle, 'CareCruToggle', `CareCruToggle--${color}`);

  return (
    <div className={classNames(className, styles.toggleWrapper)}>
      {label && (
        <label htmlFor={name || ''} className={styles.toggleLabel}>
          {label}
        </label>
      )}
      <RCToggle {...props} checked={!!checked} icons={icons} className={classes} />
    </div>
  );
};
export default Toggle

Toggle.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  icons: PropTypes.bool,
  theme: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  name: PropTypes.string,
};

Toggle.defaultProps = {
  color: isHub() ? 'electron' : 'red',
  icons: false,
  checked: '',
  label: '',
  theme: '',
  name: '',
  className: '',
};
