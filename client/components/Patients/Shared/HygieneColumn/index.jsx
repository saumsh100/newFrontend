import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../../PatientTable/styles.scss';

export default function HygieneColumn(props) {
  const {
    patient,
    className,
    showTable,
    activeAccount,
  } = props;

  const lastHygieneDate = moment(patient.lastHygieneDate);
  let intervalNum = null;

  if (!lastHygieneDate.isValid() && !showTable) {
    return null;
  } else if (!lastHygieneDate.isValid() && showTable) {
    return <div className={styles.displayFlex}> - </div>;
  }

  if (patient && patient.insuranceInterval) {
    const insuranceInterval = patient.insuranceInterval.split(' ');
    intervalNum = Number(insuranceInterval[0]);
  } else {
    const hygieneInterval = activeAccount.hygieneInterval.split(' ');
    intervalNum = Number(hygieneInterval[0]);
  }

  const hygieneDueDate = moment(lastHygieneDate).add(intervalNum, 'months');
  const monthsDiff = moment().diff(hygieneDueDate, 'months');
  const weeksDiff = moment().diff(hygieneDueDate, 'weeks');
  let dotStyle = styles.dot;

  // weeksDiff === 0 || (weeksDiff <= -1 && weeksDiff >= -4)
  // weeksDiff === -1 || weeksDiff === -4

  if (monthsDiff >= 8) {
    dotStyle = classnames(dotStyle, styles.dotRed);
  } else if (monthsDiff >= 0 && monthsDiff < 8 && weeksDiff > 0) {
    dotStyle = classnames(dotStyle, styles.dotYellow);
  } else if (weeksDiff === 0 || (weeksDiff <= -1 && weeksDiff >= -4)) {
    dotStyle = classnames(dotStyle, styles.dotGreen);
  }

  return (
    <div className={styles.displayFlex}>
      <div className={`${styles.date} ${className}`}>
        {hygieneDueDate.format('MMM DD YYYY')}
      </div>
      <div className={dotStyle}>&nbsp;</div>
    </div>
  );
}

HygieneColumn.propTypes = {
  patient: PropTypes.object,
  className: PropTypes.string,
  showTable: PropTypes.bool,
  activeAccount: PropTypes.object,
}
