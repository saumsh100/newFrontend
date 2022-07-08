import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../StandardButton';

const PopoverConfirm = (props) => <Button {...props} variant="primary" />;

PopoverConfirm.propTypes = {
  disabled: PropTypes.bool,
};

PopoverConfirm.defaultProps = {
  disabled: false,
};

export default PopoverConfirm;
