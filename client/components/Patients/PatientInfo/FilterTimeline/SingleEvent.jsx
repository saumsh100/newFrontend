
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from '../../../library';
import styles from './styles.scss';

export default function SingleEvent({ type, onClick, checked }) {
  let icon = '';
  let color = '';
  let iconType = 'solid';
  let typeText = type;

  switch (type) {
    case 'appointment':
      icon = 'calendar-alt';
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
    case 'newPatient':
      icon = 'user';
      color = 'Green';
      typeText = 'New Patient';
      break;
    case 'request':
      icon = 'calendar-check';
      color = 'Green';
      break;
    case 'dueDate':
      icon = 'calendar-plus';
      color = 'Blue';
      typeText = 'Due Date';
      break;
    case 'recall':
      icon = 'bell';
      color = 'Red';
      break;
    case 'note':
      icon = 'sticky-note';
      color = 'Blue';
      break;
    case 'followUp':
      icon = 'sticky-note';
      color = 'Blue';
      typeText = 'Follow Up';
      break;
    default:
      break;
  }

  let iconStyle = styles.iconEvent;

  if (checked) {
    iconStyle = classnames(iconStyle, styles[`selected${color}`]);
  }

  return (
    <div
      className={styles.singleEvent}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.keyCode === 13 && onClick}
      onClick={onClick}
    >
      <div className={iconStyle}>
        <Icon icon={icon} size={1} type={iconType} />
      </div>
      <div className={styles.textEvent}>{typeText}s</div>
    </div>
  );
}

SingleEvent.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};
