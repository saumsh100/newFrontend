
import React from 'react';
import PropTypes from 'prop-types';
import patientShape from '../../../library/PropTypeShapes/patient';
import Tooltip from '../../../Tooltip';
import styles from '../../PatientTable/styles.scss';

export default function ReasonColumn({ patient, className, showTable }) {
  const { patientFollowUps } = patient;

  if (!patientFollowUps || patientFollowUps.length === 0) {
    return <div className={styles.displayFlex_text}>{showTable ? '-' : 'n/a'}</div>;
  }

  const reason = patientFollowUps[0].patientFollowUpTypes.name;

  return (
    <div className={styles.displayFlex}>
      <div className={`${styles.date} ${className}`}>
        <Tooltip body={<div>{reason}</div>}>
          <div className={styles.reason_text}>{reason}</div>
        </Tooltip>
      </div>
    </div>
  );
}

ReasonColumn.propTypes = {
  className: PropTypes.string,
  patient: PropTypes.shape(patientShape).isRequired,
  showTable: PropTypes.bool,
};

ReasonColumn.defaultProps = {
  className: null,
  showTable: false,
};
