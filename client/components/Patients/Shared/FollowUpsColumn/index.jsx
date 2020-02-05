
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import patientShape from '../../../library/PropTypeShapes/patient';
import { buildDotStyles } from '../helpers';
import styles from '../../PatientTable/styles.scss';

export default function FollowUpsColumn({ patient, className, showTable }) {
  const { patientFollowUps } = patient;

  if (!patientFollowUps || patientFollowUps.length === 0) {
    return <div className={styles.displayFlex_text}>{showTable ? '-' : 'n/a'}</div>;
  }

  const followUpsDueDate = moment(patientFollowUps[0].dueAt);

  const dotStyle = buildDotStyles(followUpsDueDate, styles);

  return (
    <div className={styles.displayFlex}>
      <div className={`${styles.date} ${className}`}>{followUpsDueDate.format('MMM DD YYYY')}</div>
      <div className={dotStyle}>&nbsp;</div>
    </div>
  );
}

FollowUpsColumn.propTypes = {
  className: PropTypes.string,
  patient: PropTypes.shape(patientShape).isRequired,
  showTable: PropTypes.bool,
};

FollowUpsColumn.defaultProps = {
  className: null,
  showTable: false,
};
