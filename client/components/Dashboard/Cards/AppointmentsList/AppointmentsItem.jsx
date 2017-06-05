
import React from 'react';
import { ListItem } from '../../../library'
import ShowDateInfo from './ShowDateInfo';
import ShowPatientInfo from './ShowPatientInfo';
import ShowOtherInfo from './ShowOtherInfo';
import styles from './styles.scss';

export default function AppointmentsItem(props) {
  const {
    appointment,
    service,
    patient,
    practitioner,
    chair,
    handleAppointmentClick,
  } = props;

  const borderStyle = {
    borderLeft: '10px solid',
    borderLeftColor: practitioner.color,
  };

  return (
    <ListItem
      className={styles.appointmentListItem}
      style={borderStyle}
      onClick={() => handleAppointmentClick(appointment.id)}
    >
      <ShowDateInfo
        appointment={appointment}
      />
      <ShowPatientInfo
        patient={patient}
        appointment={appointment}
        service={service}
        chair={chair}
      />
      <ShowOtherInfo
        patient={patient}
        appointment={appointment}
      />
    </ListItem>
  );
}

