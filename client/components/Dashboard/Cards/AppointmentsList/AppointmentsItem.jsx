
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
    handlePatientClick,
  } = props;

  /*const borderStyle = {
    borderLeft: '10px solid',
    borderLeftColor: practitioner.color,
  };*/

  return (
    <ListItem
      className={styles.appointmentListItem}
     // onClick={() => handleAppointmentClick(appointment.id)}
    >
      <ShowPatientInfo
        patient={patient}
        appointment={appointment}
        service={service}
        chair={chair}
        handleAppointmentClick={handleAppointmentClick}
        handlePatientClick={handlePatientClick}
      />
      <ShowOtherInfo
        patient={patient}
        appointment={appointment}
      />
    </ListItem>
  );
}

