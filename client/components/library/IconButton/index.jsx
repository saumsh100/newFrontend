
import PropTypes from 'prop-types';
import React from 'react';
import omit from 'lodash/omit';
import classNames from 'classnames';
import Button from '../Button';
import Icon from '../Icon';
import styles from './styles.scss';

export default function IconButton(props) {
  const { className, iconClassName, size, icon, iconType, badgeText } = props;

  const classes = classNames(className, styles.iconButton);
  const buttonProps = omit(props, ['icon', 'size', 'iconClassName', 'iconType', 'badgeText']);
  return (
    <Button {...buttonProps} className={classes}>
      <Icon
        badgeText={badgeText}
        className={iconClassName}
        icon={icon}
        size={size}
        type={iconType}
      />
    </Button>
  );
}

IconButton.propTypes = {
  badgeText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  iconClassName: PropTypes.string,
  iconType: PropTypes.string,
  size: PropTypes.number,
};

IconButton.defaultProps = {
  badgeText: '',
  className: '',
  iconClassName: '',
  iconType: 'light',
  size: 1,
};
