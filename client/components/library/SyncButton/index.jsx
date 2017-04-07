
import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import classNames from 'classnames';
import Button from '../Button';
import Icon from '../Icon';
import styles from './styles.scss';

export default function SyncButton(props) {
  const {
    className,
    size,
    icon,
  } = props;

  const classes = classNames(className, styles.syncButton);
  const buttonProps = omit(props, ['icon', 'size']);
  return (
    <Button {...buttonProps} className={classes} flat>
      <Icon icon={icon} size={size} />
    </Button>
  );
}

SyncButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
};
