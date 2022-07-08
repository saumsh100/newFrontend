import React from 'react';
import PropTypes from 'prop-types';
import patientShape from '../../../library/PropTypeShapes/patient';
import { buildDotStyles } from '../helpers';
import styles from '../../PatientTable/styles.scss';
import { getUTCDate } from '../../../library';

export default function HygieneColumn(props) {
  const { patient, className, showTable, timezone } = props;

  const hygieneDueDate = getUTCDate(patient.dueForHygieneDate, timezone);

  if (!patient.dueForHygieneDate || !hygieneDueDate.isValid()) {
    return <div className={styles.displayFlex_text}>{showTable ? '-' : 'n/a'}</div>;
  }

  const dotStyle = buildDotStyles(hygieneDueDate, styles, timezone);

  return (
    <div className={styles.displayFlex}>
      <div className={`${styles.date} ${className}`}>{hygieneDueDate.format('MMM DD, YYYY')}</div>
      <div className={dotStyle}>&nbsp;</div>
    </div>
  );
}

HygieneColumn.propTypes = {
  className: PropTypes.string,
  patient: PropTypes.shape(patientShape).isRequired,
  showTable: PropTypes.bool,
  timezone: PropTypes.string.isRequired,
};

HygieneColumn.defaultProps = {
  className: null,
  showTable: false,
};
