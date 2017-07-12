
import React, { PropTypes } from 'react';
import moment from 'moment';
import styles from './styles.scss';
import Avatar from '../../../library/Avatar';

export default function ShowPatientInfo(props) {
  const {
    appointment,
    patient,
    service,
    handleAppointmentClick,
    handlePatientClick,
    index,
  } = props;


  const name = service ? service.name : ''
  const startHourMinute = moment(appointment.startDate).format('h:mm');
  const endHourMinute = moment(appointment.endDate).format('h:mm a');
  const time = startHourMinute.concat('-', endHourMinute);

  const age = moment().diff(patient.birthDate, 'years');

  const fullName = `${patient.firstName} ${patient.lastName}`;
  return (
    <div className={styles.patientContainer} data-test-id={`${patient.firstName}${index}`}>
      <Avatar className={styles.patientContainer_img} user={patient} />
      <div className={styles.patientContainer_text}>
        <div className={styles.patientContainer_name} >
          <a
            className={styles.patientContainer_name_link}
            onClick={() => handlePatientClick(patient.id)}
            href="#"
          >
          <span>{fullName.concat(', ', age)}</span>
          </a>
        </div>
        <div>
          <a
            className={styles.patientContainer_appTime}
            onClick={() => handleAppointmentClick(appointment.id)}
            href="#"
          >
          <span>{time}</span>
          </a>
        </div>
        <div className={styles.patientContainer_service}>
          <span>{name}{/*chair.name*/}</span>
        </div>
      </div>
    </div>
  );
}

ShowPatientInfo.propTypes = {
  appointment: PropTypes.object.isRequired,
  patient: PropTypes.object.isRequired,
  service: PropTypes.object.isRequired,
};
