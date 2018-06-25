
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Avatar, Icon } from '../../library';
import { patientShape } from '../../library/PropTypeShapes';
import { FormatPhoneNumber } from '../../library/util/Formatters';
import styles from './styles.scss';

const PatientData = (props) => {
  const { patient, selectPatient, selectedPatient } = props;

  const fullName = `${patient.firstName} ${patient.lastName}`;

  return (
    <Button
      className={classNames(styles.singleSuggestion, {
        [styles.patientSelected]: selectedPatient && selectedPatient.id === patient.id,
      })}
      onClick={() => {
        selectPatient(patient);
      }}
    >
      <div className={styles.suggestionsListItem}>
        <Avatar size="md" className={styles.patientContainer_img} user={patient} alt={fullName} />
        <div className={styles.patientContainer}>
          <div className={styles.patientContainer_fullName}>{fullName}</div>
          <div className={styles.data}>
            <Icon icon="phone" size={0.9} type="solid" />
            <div className={styles.data_text}>
              {patient.mobilePhoneNumber && patient.mobilePhoneNumber[0] === '+'
                ? FormatPhoneNumber(patient.mobilePhoneNumber)
                : patient.mobilePhoneNumber}
            </div>
          </div>
          <div className={styles.data}>
            <Icon icon="envelope" size={0.9} type="solid" />
            <div className={styles.data_text}>{patient.email}</div>
          </div>
        </div>
      </div>
    </Button>
  );
};

PatientData.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  selectPatient: PropTypes.func.isRequired,
  selectedPatient: PropTypes.shape(patientShape),
};

PatientData.defaultProps = {
  selectedPatient: null,
};

export default PatientData;
