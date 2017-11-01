
import React, { PropTypes } from 'react';
import moment from 'moment';{}
import { Card } from '../library';
import styles from './styles.scss';

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');

  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');

  const results = regex.exec(url);

  if (!results) return null;

  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export default function ConfirmedAppointment({ onSubmit }) {
  const startDate = getParameterByName('startDate');
  const endDate = getParameterByName('startDate');
  return (
    <div className={styles.backDrop}>
      <Card className={styles.loginForm}>
        <div className={styles.logoContainer}>
          <img
            className={styles.loginLogo}
            src="/images/logo_black.png"
            alt="CareCru Logo"
          />
        </div>
        <div className={styles.sidebar__information_title}>
          YOUR APPOINTMENT WITH JD IS CONFIRMED
        </div>
        <br />
        <div className={styles.sidebar__information_text}>
          {moment(startDate).format('dddd, MMMM Do YYYY')}
        </div>
        <div className={styles.sidebar__information_text}>
          {moment(startDate).format('h:mm a')}
        </div>
      </Card>
    </div>
  );
}

ConfirmedAppointment.propTypes = {
};
