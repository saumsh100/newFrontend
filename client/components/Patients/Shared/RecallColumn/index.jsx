
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import patientShape from '../../../library/PropTypeShapes/patient';
import styles from '../../PatientTable/styles.scss';

export default function RecallColumn(props) {
  const { patient, className, showTable } = props;

  const displayNa = <div className={styles.displayFlex_text}>{showTable ? '-' : 'n/a'}</div>;

  if (!patient.dueForRecallExamDate) {
    return displayNa;
  }

  const recallDueDate = moment(patient.dueForRecallExamDate);

  if (!recallDueDate.isValid()) {
    return displayNa;
  }

  const monthsDiff = moment().diff(recallDueDate, 'months');
  const weeksDiff = moment().diff(recallDueDate, 'weeks');
  let dotStyle = styles.dot;
  if (monthsDiff >= 8) {
    dotStyle = classnames(dotStyle, styles.dotRed);
  } else if (monthsDiff >= 0 && monthsDiff < 8 && weeksDiff > 0) {
    dotStyle = classnames(dotStyle, styles.dotYellow);
  } else if (weeksDiff === 0 || (weeksDiff <= -1 && weeksDiff >= -4)) {
    dotStyle = classnames(dotStyle, styles.dotGreen);
  }

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
