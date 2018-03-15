
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Avatar, PatientPopover, AppointmentPopover } from '../../../library';
import styles from './styles.scss';
import { FormatPhoneNumber } from '../../../library/util/Formatters';

export default function PatientInfo(props) {
  const {
    patient,
    insightData,
    appointment,
    scrollId,
  } = props;

  if (!patient || !appointment) {
    return null;
  }

  let count = insightData.length;

  insightData.forEach((insight) => {
    if (insight.type === 'confirmAttempts' && !patient.mobilePhoneNumber) {
      count -= 1;
    }
  });

  return (
    <div className={styles.patientInfo}>
      <div className={styles.patientInfo_body}>
        <div className={styles.patientInfo_avatarContainer}>
          <div className={styles.insightCount}>
            <div>{count}</div>
          </div>
        </div>

        <div className={styles.patientInfo_name}>
          <PatientPopover
            scrollId={scrollId}
            patient={patient}
          >
            <div className={styles.patientNameAvatar}>
              <Avatar user={patient} size="sm" noPadding />

              <div className={styles.patientNameAvatar_text}>
                <div className={styles.patientInfo_firstLast}>
                  {patient.firstName}
                </div>
                <div className={styles.patientInfo_firstLast}>
                  {patient.lastName}
                </div>
              </div>
            </div>
          </PatientPopover>
        </div>

        <AppointmentPopover
          scrollId={scrollId}
          appointment={appointment}
          patient={patient}
        >
          <div className={styles.apptData}>
            <div className={styles.apptData_time}>
              {moment(appointment.startDate).format('h:mm a')}
            </div>
            <div className={styles.apptData_date}>
              {moment(appointment.startDate).format('MMM DD')}
            </div>
          </div>
        </AppointmentPopover>
      </div>
    </div>
  );
}

PatientInfo.propTypes = {
  patient: PropTypes.instanceOf(Object),
  insightData: PropTypes.instanceOf(Array),
  appointment: PropTypes.instanceOf(Object),
};
