
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from './index';
import styles from './popover.scss';

const PopoverConfirm = props => <Button {...props} className={classNames(styles.confirm)} />;

PopoverConfirm.propTypes = {
  disabled: PropTypes.bool,
};

PopoverConfirm.defaultProps = {
  disabled: false,
};

export default PopoverConfirm;
