
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from './index';
import styles from './primary.scss';

const PrimaryButton = props => (
  <Button {...props} className={classNames(styles.button, { [styles.disabled]: props.disabled })} />
);

PrimaryButton.propTypes = {
  disabled: PropTypes.bool,
};

PrimaryButton.defaultProps = {
  disabled: false,
};

export default PrimaryButton;
