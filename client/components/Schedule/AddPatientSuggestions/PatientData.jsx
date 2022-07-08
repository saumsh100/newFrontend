import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formatPhoneNumber } from '../../../util/isomorphic';
import { Button, Avatar, Icon } from '../../library';
import { patientShape } from '../../library/PropTypeShapes';
import styles from './reskin-styles.scss';

const PatientData = (props) => {
  const { patient, selectPatient, selectedPatient } = props;
  const fullName = `${patient.firstName} ${patient.lastName}`;
  const patientPhoneNo = patient.mobilePhoneNumber || patient.cellPhoneNumber;

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
          {patientPhoneNo && (
            <div className={styles.data}>
              <Icon icon="phone" size={0.9} type="solid" className={styles.dataIcon} />
              <div className={styles.data_text}>{formatPhoneNumber(patientPhoneNo)}</div>
            </div>
          )}
          {patient.email && (
            <div className={styles.data}>
              <Icon icon="envelope" size={0.9} type="solid" className={styles.dataIcon} />
              <div className={styles.data_text}>{patient.email}</div>
            </div>
          )}
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

PatientData.defaultProps = { selectedPatient: null };

export default PatientData;
