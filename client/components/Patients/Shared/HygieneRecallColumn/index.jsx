import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../../PatientTable/styles.scss';


export default function HygieneRecallColumn(props) {
  const {
    patient,
    className,
    activeAccount,
  } = props;

  const lastHygieneDate = moment(patient.lastHygieneDate);
  const lastRecallDate = moment(patient.lastRecallDate);

  let intervalNum = null;
  let hygieneIntervalNum = null;
  let recallIntervalNum = null;

  if (!lastHygieneDate.isValid() && !lastRecallDate.isValid()) {
    return <div className={styles.displayFlex}> - </div>;
  }

  if (patient && patient.insuranceInterval) {
    const insuranceInterval = patient.insuranceInterval.split(' ');
    intervalNum = Number(insuranceInterval[0]);
    hygieneIntervalNum = intervalNum;
    recallIntervalNum = intervalNum;
  } else {
    const hygieneInterval = activeAccount.hygieneInterval.split(' ');
    hygieneIntervalNum = Number(hygieneInterval[0]);

    const recallInterval = activeAccount.recallInterval.split(' ');
    recallIntervalNum = Number(recallInterval[0]);
  }

  const hygieneDueDate = moment(lastHygieneDate).add(hygieneIntervalNum, 'months');
  const recallDueDate = moment(lastRecallDate).add(recallIntervalNum, 'months');
  let showDate = null;

  const monthsDiffHygiene = moment().diff(hygieneDueDate, 'months');
  const monthsDiffRecall = moment().diff(recallDueDate, 'months');
  let monthsDiff = null;

  if (monthsDiffHygiene && monthsDiffRecall) {
    if (monthsDiffHygiene > monthsDiffRecall) {
      monthsDiff = monthsDiffHygiene;
      showDate = hygieneDueDate;
    } else {
      monthsDiff = monthsDiffRecall;
      showDate = recallDueDate;
    }
  } else if (monthsDiffHygiene && !monthsDiffRecall) {
    monthsDiff = monthsDiffHygiene;
    showDate = hygieneDueDate;
  } else {
    monthsDiff = monthsDiffRecall;
    showDate = recallDueDate;
  }

  let dotStyle = styles.dot;

  if (monthsDiff >= 8) {
    dotStyle = classnames(dotStyle, styles.dotRed);
  } else if (monthsDiff > 0 && monthsDiff < 8) {
    dotStyle = classnames(dotStyle, styles.dotYellow);
  } else if (monthsDiff <= 0 && monthsDiff >= -1) {
    dotStyle = classnames(dotStyle, styles.dotGreen);
  }

  return (
    <div className={styles.displayFlex}>
      <div className={`${styles.date} ${className}`}>
        {showDate.format('MMM DD YYYY')}
      </div>
      <div className={dotStyle}>&nbsp;</div>
    </div>
  );
}

HygieneRecallColumn.propTypes = {
  patient: PropTypes.object,
  className: PropTypes.string,
  activeAccount: PropTypes.object,
};
