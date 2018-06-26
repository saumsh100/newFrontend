
import React from 'react';
import PropTypes from 'prop-types';
import { IconCard, Grid, Row, Col } from '../../../library';
import styles from '../styles.scss';

export default function StatCards(props) {
  const { requests, appointments, insightCount } = props;

  const unConfirmedPatients = appointments.filter(app => !app.isPatientConfirmed);

  const onlineAppointmentRequest = {
    count: requests.size,
    title: requests.size === 1 ? 'Online Request' : 'Online Requests',
    src: '/images/icons/Appt-Requests.png',
    size: 6,
    color: 'blue',
  };

  const appointmentsToday = {
    count: appointments.size,
    title: appointments.size === 1 ? 'Appointment Today' : 'Appointments Today',
    src: '/images/icons/Appts-Today.png',
    size: 6,
    color: 'red',
  };

  const patientInsights = {
    count: insightCount,
    title: insightCount === 1 ? 'Patient Insight' : 'Patient Insights',
    src: '/images/icons/Patient-Insights.png',
    size: 6,
    color: 'yellow',
  };

  const patientsUnConfirmed = {
    count: unConfirmedPatients.size,
    title:
      unConfirmedPatients.size === 1
        ? 'Patient Unconfirmed'
        : 'Patients Unconfirmed',
    src: '/images/icons/Unconfirmed-Patients.png',
    size: 6,
    color: 'grey',
  };

  return (
    <div className={styles.statCards}>
      <div className={styles.stat}>
        <IconCard {...onlineAppointmentRequest} />
      </div>
      <div className={styles.stat}>
        <IconCard {...patientInsights} />
      </div>
      <div className={styles.stat}>
        <IconCard {...appointmentsToday} />
      </div>
      <div className={styles.stat}>
        <IconCard {...patientsUnConfirmed} />
      </div>
    </div>
  );
}
