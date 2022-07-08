import PropTypes from 'prop-types';
import React from 'react';
import { BackgroundIcon } from '..';
import styles from './styles.scss';

export default function DoubleIcon(props) {
  const { smallIcon, bigIcon } = props;
  const { icon, background } = smallIcon;
  return (
    <div className={styles.containter}>
      <div className={styles.containter__bigIcon}>
        <img src={bigIcon.src} alt="" />
      </div>
      <div className={styles.containter__smallIcon}>
        <BackgroundIcon icon={icon} color={background} fontSize={2} />
      </div>
    </div>
  );
}

DoubleIcon.propTypes = {
  smallIcon: PropTypes.shape({
    icon: PropTypes.shape({
      src: PropTypes.string,
    }),
    background: PropTypes.string,
  }).isRequired,
  bigIcon: PropTypes.shape({
    src: PropTypes.string,
  }).isRequired,
};
