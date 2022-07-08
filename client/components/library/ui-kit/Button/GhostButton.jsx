import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from './index';
import styles from './ghost.scss';

const GhostButton = ({ className, active, ...props }) => (
  <Button
    {...props}
    className={classNames(styles.button, className, {
      [styles.disabled]: props.disabled,
      [styles.active]: active,
    })}
  />
);

GhostButton.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  active: PropTypes.bool,
};

GhostButton.defaultProps = {
  disabled: false,
  className: '',
  active: false,
};

export default GhostButton;
