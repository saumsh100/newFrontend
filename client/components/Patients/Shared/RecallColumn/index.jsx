
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import patientShape from '../../../library/PropTypeShapes/patient';
import { buildDotStyles } from '../helpers';
import styles from '../../PatientTable/styles.scss';

export default function RecallColumn(props) {
  const { patient, className, showTable } = props;

  const recallDueDate = moment(patient.dueForRecallExamDate);

  if (!patient.dueForRecallExamDate || !recallDueDate.isValid()) {
    return <div className={styles.displayFlex_text}>{showTable ? '-' : 'n/a'}</div>;
  }

  const dotStyle = buildDotStyles(recallDueDate, styles);

  return (
    <div className={styles.displayFlex}>
      <div className={`${styles.date} ${className}`}>{recallDueDate.format('MMM DD YYYY')}</div>
      <div className={dotStyle}>&nbsp;</div>
    </div>
  );
}

RecallColumn.propTypes = {
  className: PropTypes.string,
  patient: PropTypes.shape(patientShape).isRequired,
  showTable: PropTypes.bool,
};

RecallColumn.defaultProps = {
  className: null,
  showTable: false,
};
