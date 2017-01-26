
import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import classNames from 'classnames';
import Button from '../Button';
import Icon from '../Icon';
import styles from './styles.scss';

export default function IconButton(props) {
  const {
    className,
    size,
    icon,
  } = props;
  
  console.log('IconButton size', size);
  
  const classes = classNames(className, styles.iconButton);
  const buttonProps = omit(props, ['icon', 'size']);
  return (
    <Button {...buttonProps} className={classes}>
      <Icon icon={icon} size={size} />
    </Button>
  );
}

IconButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
};
