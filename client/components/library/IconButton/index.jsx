
import PropTypes from 'prop-types';
import React from 'react';
import omit from 'lodash/omit';
import classNames from 'classnames';
import Button from '../Button';
import Icon from '../Icon';
import styles from './styles.scss';

export default function IconButton(props) {
  const {
    className, iconClassName, size, icon, iconType,
  } = props;

  const classes = classNames(className, styles.iconButton);
  const buttonProps = omit(props, [
    'icon',
    'size',
    'iconClassName',
    'iconType',
  ]);
  return (
    <Button {...buttonProps} className={classes}>
      <Icon icon={icon} className={iconClassName} size={size} type={iconType} />
    </Button>
  );
}

IconButton.propTypes = {
  iconType: PropTypes.string,
  iconClassName: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
};
