
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import Icon from '../Icon';
import styles from './styles.scss';
import ReviewEvent from './ReviewEvent';
import ReminderEvent from './ReminderEvent';
import CallEvent from './CallEvent';
import AppointmentEvent from './AppointmentEvent';
import NewPatientEvent from './NewPatientEvent';

class Event extends Component {
  render() {
    const {
      type,
      data,
    } = this.props;

    let content = null;
    let icon = '';
    let bgIconStyle = styles.bgIcon;

    if (type === 'appointment') {
      icon = 'calendar';
      bgIconStyle = classnames(bgIconStyle, styles.blueBorder);
      content = <AppointmentEvent data={data} />;
    }

    if (type === 'reminder') {
      icon = 'comment';
      bgIconStyle = classnames(bgIconStyle, styles.redBorder);
      content = <ReminderEvent data={data} />;
    }

    if (type === 'review') {
      icon = 'star';
      bgIconStyle = classnames(bgIconStyle, styles.yellowBorder);
      content = <ReviewEvent data={data} />;
    }

    if (type === 'call') {
      icon = 'phone';
      bgIconStyle = classnames(bgIconStyle, styles.yellowBorder);
      content = <CallEvent data={data} />;
    }

    if (type === 'new patient') {
      icon = 'user';
      bgIconStyle = classnames(bgIconStyle, styles.greenBorder);
      content = <NewPatientEvent data={data} />
    }

    return (
      <div className={styles.eventContainer}>
        <div className={styles.event}>
          <div className={styles.iconContainer}>
            <div className={bgIconStyle}>
              <Icon size={1} icon={icon} className={styles.icon}/>
            </div>
          </div>
          {content}
        </div>
        <div className={styles.time}>
          <span className={styles.time_text}>{moment(data.createdAt).format('h:mm a')}</span>
        </div>
      </div>
    );
  }
}

Event.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default Event;
