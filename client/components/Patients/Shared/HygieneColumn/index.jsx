import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../../PatientTable/styles.scss';


export default function HygieneColumn(props) {
  const {
    patient,
    className,
  } = props;

  const lastApptDate = moment(patient.lastHygieneDate);

  if (!lastApptDate.isValid()) {
    return (
      <div className={styles.displayFlex}>
        <div className={styles.cellText_lastAppt}>
          -
        </div>
      </div>
    );
  }

  const hygieneDate = lastApptDate;
  const months = moment().diff(hygieneDate, 'months');

  let dotStyle = styles.dot;

  if (months >= 9) {
    dotStyle = classnames(dotStyle, styles.dotRed);
  } else if (months >= 6 && months < 9) {
    dotStyle = classnames(dotStyle, styles.dotYellow);
  } else if (months < 6 && months > 3) {
    dotStyle = classnames(dotStyle, styles.dotGreen);
  }


  return (<div className={styles.displayFlex}>
    <div className={`${styles.date} ${className}`}>{hygieneDate.format('MMM DD YYYY')}</div>
    <div className={dotStyle}>&nbsp;</div>
  </div>
  );
}

HygieneColumn.propTypes = {
  patient: PropTypes.object,
}
