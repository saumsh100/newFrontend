import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Icon from '../Icon';
import styles from './styles.scss';

class Event extends Component {
  render() {
    const {
      type,
      time,
    } = this.props;

    let content = null;
    let icon = '';
    let bgIconStyle = styles.bgIcon;

    if (type === 'email') {
      icon = 'envelope';
      bgIconStyle = classnames(bgIconStyle, styles.greenBorder);
      content = (
        <div className={styles.body}>
          <div className={styles.body_header}>
            Subject: Need to confirm information | Status: Email Sent
          </div>
          <div className={styles.body_subHeader}>
            Random text goes in here to fill the subheader section
          </div>
        </div>
      );
    }

    if (type === 'appointment') {
      icon = 'calendar-o';
      bgIconStyle = classnames(bgIconStyle, styles.blueBorder);
      content = (
        <div className={styles.body}>
          <div className={styles.body_header}>
            Appointment for Teeth Filling booked on September 30 at 11:00am
          </div>
          <div className={styles.body_subHeaderItalic}>
            Random text goes in here to fill the subheader section
          </div>
        </div>
      );
    }

    if (type === 'message') {
      icon = 'comment';
      bgIconStyle = classnames(bgIconStyle, styles.redBorder);
      content = (
        <div className={styles.body}>
          <div className={styles.body_subHeader}>
            Random text goes in here to fill the subheader section
          </div>
        </div>
      );
    }

    if (type === 'review') {
      icon = 'star';
      bgIconStyle = classnames(bgIconStyle, styles.yellowBorder);
      content = (
        <div className={styles.body}>
          <div className={styles.body_header}>
            Review Left on Google+
          </div>
          <div className={styles.body_subHeader}>
            Random text goes in here to fill the subheader section
          </div>
        </div>
      );
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
          <span className={styles.time_text}>10:30am</span>
        </div>
      </div>
    );
  }
}

Event.propTypes = {

};

export default Event;
