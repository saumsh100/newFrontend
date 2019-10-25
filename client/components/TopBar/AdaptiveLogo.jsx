
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const AdaptiveLogo = ({ imagePath, description, isCollapsed }) => (
  <div className={!isCollapsed ? styles.logoWrapper : styles.logoWrapperCollapsed}>
    <div className={!isCollapsed ? styles.logoImage : styles.logoImageCollapsed}>
      <img
        className={!isCollapsed ? styles.logoImageImage : styles.logoImageImageCollapsed}
        src={imagePath}
        alt={description}
      />
    </div>
  </div>
);

AdaptiveLogo.propTypes = {
  imagePath: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
};

export default AdaptiveLogo;
