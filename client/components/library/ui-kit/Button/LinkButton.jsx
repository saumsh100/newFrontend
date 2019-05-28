
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from './index';
import styles from './link.scss';

const LinkButton = ({ className, ...props }) => (
  <Button
    {...props}
    className={classNames(styles.button, className, { [styles.disabled]: props.disabled })}
  />
);

LinkButton.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

LinkButton.defaultProps = {
  disabled: false,
  className: '',
};

export default LinkButton;
