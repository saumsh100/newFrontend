
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../Icon';
import ReviewEvent from './ReviewEvent';
import ReminderEvent from './ReminderEvent';
import CallEvent from './CallEvent';
import AppointmentEvent from './AppointmentEvent';
import NewPatientEvent from './NewPatientEvent';
import RequestEvent from './RequestEvent';
import dateFormatter from '../../../../iso/helpers/dateTimezone/dateFormatter';
import styles from './styles.scss';

export default function Event(props) {
  const { type, data, bgColor } = props;

  let content = null;
  let icon = '';
  let iconType = 'solid';
  let bgIconStyle = styles.bgIcon;

  let bodyStyle = styles.body;
  let callStyle = styles.call;

  if (bgColor) {
    bodyStyle = classnames(bodyStyle, styles[`${bgColor}BgColor`]);
    callStyle = classnames(callStyle, styles[`${bgColor}BgColor`]);
  }

  if (type === 'appointment') {
    icon = 'calendar';
    bgIconStyle = classnames(bgIconStyle, styles.blueBorder);
    iconType = 'regular';
    content = <AppointmentEvent data={data} bodyStyle={bodyStyle} />;
  }

  if (type === 'reminder') {
    icon = 'bell';
    bgIconStyle = classnames(bgIconStyle, styles.redBorder);
    content = <ReminderEvent data={data} bodyStyle={bodyStyle} />;
  }

  if (type === 'review') {
    icon = 'star';
    bgIconStyle = classnames(bgIconStyle, styles.yellowBorder);
    content = <ReviewEvent data={data} bodyStyle={bodyStyle} />;
  }

  if (type === 'call') {
    icon = 'phone';
    bgIconStyle = classnames(bgIconStyle, styles.yellowBorder);
    content = <CallEvent data={data} callStyle={callStyle} />;
  }

  if (type === 'newpatient') {
    icon = 'user';
    bgIconStyle = classnames(bgIconStyle, styles.greenBorder);
    content = <NewPatientEvent data={data} bodyStyle={bodyStyle} />;
  }

  if (type === 'request') {
    icon = 'calendar-check';
    bgIconStyle = classnames(bgIconStyle, styles.greenBorder);
    content = <RequestEvent data={data} bodyStyle={bodyStyle} />;
  }

  return (
    content && (
      <div className={styles.eventContainer}>
        <div className={styles.event}>
          <div className={styles.iconContainer}>
            <div className={bgIconStyle}>
              <Icon size={1} icon={icon} className={styles.icon} type={iconType} />
            </div>
          </div>
          {content}
        </div>
        <div className={styles.time}>
          <span className={styles.time_text}>{dateFormatter(data.createdAt, '', 'h:mm a')}</span>
        </div>
      </div>
    )
  );
}

Event.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  bgColor: PropTypes.string,
};

Event.defaultProps = {
  bgColor: '',
};
