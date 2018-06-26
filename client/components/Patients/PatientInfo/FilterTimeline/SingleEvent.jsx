
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from '../../../library';
import styles from './styles.scss';

export default function SingleEvent({ type, onClick, checked }) {
  let icon = '';
  let color = '';
  let iconType = 'solid';

  switch (type) {
    case 'appointment':
      icon = 'calendar';
      color = 'Blue';
      iconType = 'regular';
      break;
    case 'reminder':
      icon = 'bell';
      color = 'Red';
      break;
    case 'review':
      icon = 'star';
      color = 'Yellow';
      break;
    case 'call':
      icon = 'phone';
      color = 'Yellow';
      break;
    case 'new patient':
      icon = 'user';
      color = 'Green';
      break;
  }

  let iconStyle = styles.iconEvent;

  if (checked) {
    iconStyle = classnames(iconStyle, styles[`selected${color}`]);
  }

  return (
    <div className={styles.singleEvent} onClick={onClick}>
      <div className={iconStyle}>
        <Icon icon={icon} size={2} type={iconType} />
      </div>
      <div className={styles.textEvent}>{type}s</div>
    </div>
  );
}
