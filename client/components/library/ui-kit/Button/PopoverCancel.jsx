
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from './index';
import styles from './popover.scss';

const PopoverCancel = props => <Button {...props} className={classNames(styles.cancel)} />;

PopoverCancel.propTypes = {
  disabled: PropTypes.bool,
};

PopoverCancel.defaultProps = {
  disabled: false,
};

export default PopoverCancel;
