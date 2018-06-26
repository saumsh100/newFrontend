
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
    const { type, data, bgColor } = this.props;

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

    if (type === 'new patient') {
      icon = 'user';
      bgIconStyle = classnames(bgIconStyle, styles.greenBorder);
      content = <NewPatientEvent data={data} bodyStyle={bodyStyle} />;
    }

    return (
      <div className={styles.eventContainer}>
        <div className={styles.event}>
          <div className={styles.iconContainer}>
            <div className={bgIconStyle}>
              <Icon
                size={1}
                icon={icon}
                className={styles.icon}
                type={iconType}
              />
            </div>
          </div>
          {content}
        </div>
        <div className={styles.time}>
          <span className={styles.time_text}>
            {moment(data.createdAt).format('h:mm a')}
          </span>
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
