
import React from 'react';
import PropTypes from 'prop-types';
import {
  IconCard,
  Grid,
  Row,
  Col,
} from '../../../library';
import styles from '../styles.scss';

export default function StatCards(props) {
  const {
    requests,
    appointments,
    insightCount,
  } = props;

  const unConfirmedPatients = appointments.filter((app) => {
    return !app.isPatientConfirmed;
  });

  const onlineAppointmentRequest = {
    count: requests.size,
    title: requests.size === 1 ? 'Appointment Request' : 'Appointment Requests',
    icon: 'calendar',
    size: 6,
    color: 'blue',
  };

  const appointmentsToday = {
    count: appointments.size,
    title: appointments.size === 1 ? 'Appointment Today' : 'Appointments Today',
    icon: 'user',
    size: 6,
    color: 'red',
  };

  const patientInsights = {
    count: insightCount,
    title: insightCount === 1 ? 'Patient Insight' : 'Patient Insights',
    icon: 'lightbulb',
    size: 6,
    color: 'yellow',
  };

  const patientsUnConfirmed = {
    count: unConfirmedPatients.size,
    title: unConfirmedPatients.size === 1 ? 'Patient Unconfirmed' : 'Patients Unconfirmed',
    icon: 'list-alt',
    size: 6,
    color: 'grey',
  };

  return (
    <div className={styles.statCards}>
      <div className={styles.stat}>
        <IconCard {...onlineAppointmentRequest} />
      </div>
      <div className={styles.stat}>
        <IconCard {...appointmentsToday} />
      </div>
      <div className={styles.stat}>
        <IconCard {...patientInsights} />
      </div>
      <div className={styles.stat}>
        <IconCard {...patientsUnConfirmed} />
      </div>
    </div>
  );
}
