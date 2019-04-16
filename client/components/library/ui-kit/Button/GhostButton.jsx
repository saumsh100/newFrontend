
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from './index';
import styles from './ghost.scss';

const GhostButton = props => (
  <Button {...props} className={classNames(styles.button, { [styles.disabled]: props.disabled })} />
);

GhostButton.propTypes = {
  disabled: PropTypes.bool,
};

GhostButton.defaultProps = {
  disabled: false,
};

export default GhostButton;
