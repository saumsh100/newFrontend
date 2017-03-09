import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {
  IconButton,
  Card
} from '../../library';
import styles from './styles.scss';

class NewRequests extends Component {
  render() {
    const hardcodeData = [
      {
        day: moment().format(),
        start: moment({ hour: 15, minute: 0 }),
        end: moment({ hour: 16, minute: 59 }),
        patientName: 'Perla Frye',
        patientAge: 23,
        patientPhone: '(123) 456 7898',
        services: 'Teeth Whitening Consultation',
        status: 'New'
      },
      {
        day: moment().format(),
        start: moment({ hour: 15, minute: 0 }),
        end: moment({ hour: 16, minute: 59 }),
        patientName: 'Perla Frye',
        patientAge: 23,
        patientPhone: '(123) 456 7898',
        services: 'Teeth Whitening Consultation',
        status: 'Waitlist'
      },
      {
        day: moment().format(),
        start: moment({ hour: 15, minute: 0 }),
        end: moment({ hour: 16, minute: 59 }),
        patientName: 'Perla Frye',
        patientAge: 23,
        patientPhone: '(123) 456 7898',
        services: 'Teeth Whitening Consultation',
        status: 'New'
      },
      {
        day: moment().format(),
        start: moment({ hour: 15, minute: 0 }),
        end: moment({ hour: 16, minute: 59 }),
        patientName: 'Perla Frye',
        patientAge: 23,
        patientPhone: '(123) 456 7898',
        services: 'Teeth Whitening Consultation',
        status: 'Waitlist'
      }
    ];
    return (
      <Card className={styles.schedule_appointment}>
        <div className={styles.appointment_header}>
          <div className={styles.appointment_header__title}>
            New Appointment Requests
          </div>
          <div className={styles.appointment_header__icon}>
            <IconButton icon="bell" onClick={() => alert('Implement Notifications')} />
          </div>
        </div>
        <div className={styles.appointment_practitioner}>
          <ul className={styles.appointment_practitioner__wrapper}>
            {hardcodeData.map((h) => {
              return (
                <li className={styles.appointment_practitioner__item}>
                  <div className={styles.item__day}>
                    <div className={styles.item__day_month}>{moment(h.day).format('MMM')}</div>
                    <div className={styles.item__day_number}>{moment(h.day).format('D')}</div>
                  </div>
                  <div className={styles.item__information}>
                    <div className={styles.item__information_title}>{`${moment(h.start).format('hh:mm')} - ${moment(h.end).format('hh:mm A')}`}</div>
                    <div className={styles.item__information_patient}>{`${h.patientName},${h.patientAge}`}</div>
                    <div className={styles.item__information_phone}>{h.patientPhone}</div>
                    <div className={styles.item__information_services}>{h.services}</div>
                    <div className={styles.item__information_status}>{h.status}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>
    );
  }
}


export default NewRequests;
