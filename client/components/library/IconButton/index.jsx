
import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import classNames from 'classnames';
import VButton from '../VButton';
import Icon from '../Icon';
import styles from './styles.scss';

export default function IconButton(props) {
  const {
    className,
    size,
    icon,
  } = props;

  const classes = classNames(className, styles.iconButton);
  const buttonProps = omit(props, ['icon', 'size']);
  return (
    <VButton {...buttonProps} className={classes}>
      <Icon icon={icon} size={size} />
    </VButton>
  );
}

IconButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
};
