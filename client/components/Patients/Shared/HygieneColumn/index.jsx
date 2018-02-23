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
  } = props;

  const lastApptDate = moment(patient.lastHygieneDate);

  if (!lastApptDate.isValid() && !showTable) {
    return null;
  } else if (!lastApptDate.isValid() && showTable) {
    return <div className={styles.displayFlex}> - </div>;
  }

  const hygieneDate = moment(lastApptDate).add(6, 'months');
  const months = moment().diff(lastApptDate, 'months');

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
