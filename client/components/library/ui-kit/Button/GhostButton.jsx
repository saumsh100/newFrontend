
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from './index';
import styles from './ghost.scss';

const GhostButton = ({ className, ...props }) => (
  <Button
    {...props}
    className={classNames(styles.button, className, { [styles.disabled]: props.disabled })}
  />
);

GhostButton.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

GhostButton.defaultProps = {
  disabled: false,
  className: '',
};

export default GhostButton;
