import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './styles.scss';

class NewRequests extends Component {
  render() {

    const { requests, services, appointments, patients } = this.props;
    const day = moment().format();
    const data = requests.models.toArray().map(r => {
      const patient = patients.models.toJS()[r.patientId];
      const service = services && services.models.toJS()[r.serviceId];
      const serviceName = service && service.name; 
      const { firstName, lastName, birthDate, phoneNumber } = patient;
      const patientName = `${firstName} ${lastName}`;
      const patientAge = birthDate && moment().diff(birthDate, 'years');
      const patientPhone = phoneNumber;
      const start = moment(r.startTime);
      const end = moment(r.endTime);
      return {
        day,
        start,
        end,
        patientName,
        patientAge,
        patientPhone,
        services: serviceName,
      }
    });

    return (
      <div className={styles.schedule_appointment}>
        <div className={styles.appointment_header}>
          <div className={styles.appointment_header__title}>
            New Appointment Requests
          </div>
          <div className={styles.appointment_header__icon}>
            <i className="fa fa-bell" />
          </div>
        </div>
        <div className={styles.appointment_practitioner}>
          <ul className={styles.appointment_practitioner__wrapper}>
            {data.map((h) => {
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
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default NewRequests;