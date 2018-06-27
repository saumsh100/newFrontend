
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../../library';
import styles from './styles.scss';

export default function IconCircle(props) {
  const { selected, icon, color } = props;

  // If it has an underscore we can guarantee we need to stack them
  let iconComponent = null;
  const stackedIcons = icon.indexOf('_') > -1;
  if (stackedIcons) {
    const [primaryIcon, secondaryIcon] = icon.split('_');
    iconComponent = (
      <div className={styles.stackedIconsWrapper}>
        <Icon
          icon={secondaryIcon}
          className={styles.secondaryIcon}
          type="solid"
        />
        <Icon icon={primaryIcon} className={styles.primaryIcon} type="solid" />
      </div>
    );
  } else if (icon) {
    iconComponent = <Icon icon={icon} type="solid" />;
  }

  const wrapperClass = selected
    ? styles[`selectWrapperCircleSelected_${color}`]
    : styles.selectWrapperCircle;

  return (
    <div className={wrapperClass}>
      <div className={styles.wrapperCircle}>
        <div className={styles[`iconCircle_${color}`]}>{iconComponent}</div>
      </div>
    </div>
  );
}

IconCircle.propTypes = {
  icon: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  color: PropTypes.string.isRequired,
};

IconCircle.defaultProps = {
  color: 'green',
};
