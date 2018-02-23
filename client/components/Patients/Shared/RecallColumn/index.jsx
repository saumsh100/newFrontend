
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../../PatientTable/styles.scss';


export default function RecallColumn(props) {
  const {
    patient,
    className,
    showTable,
  } = props;

  const lastRecallDate = moment(patient.lastRecallDate);

  if (!lastRecallDate.isValid() && !showTable) {
    return null;
  } else if (!lastRecallDate.isValid() && showTable) {
    return <div className={styles.displayFlex}> - </div>;
  }
  const months = moment().diff(lastRecallDate, 'months');
  const weeks = moment().diff(lastRecallDate, 'weeks');

  let dotStyle = styles.dot;
  if (months >= 9) {
    dotStyle = classnames(dotStyle, styles.dotRed);
  } else if (months >= 6 && months < 9) {
    dotStyle = classnames(dotStyle, styles.dotYellow);
  } else if (months < 6 && weeks >= 20) {
    dotStyle = classnames(dotStyle, styles.dotGreen);
  }

  return (
    <div className={styles.displayFlex}>
      <div className={`${styles.date} ${className}`}>{lastRecallDate.add(6, 'months').format('MMM DD YYYY')}</div>
      <div className={dotStyle}>&nbsp;</div>
    </div>
  );
}

RecallColumn.propTypes = {
  patient: PropTypes.object,
}
