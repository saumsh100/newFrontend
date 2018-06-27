
import React, { PropTypes, Component } from 'react';
import {
  Card,
  Checkbox,
  Search,
  Form,
  Field,
  BackgroundIcon,
} from '../../library';
import colorMap from '../../library/util/colorMap';
import styles from './styles.scss';

export default function DoubleIcon(props) {
  const { smallIcon, bigIcon } = props;
  console.log(smallIcon);
  const {
    iconColor, icon, background, iconAlign,
  } = smallIcon;
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
