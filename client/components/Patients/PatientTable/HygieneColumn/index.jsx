import moment from 'moment';
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from '../styles.scss';

export default function HygieneColumn(props) {
  const {
    patient,
  } = props;
  
  const lastApptDate = moment(patient.lastApptDate);

  if (!lastApptDate.isValid()) {
    return null
  }

  const compareDate = moment().subtract(6, 'months');
  const days = compareDate.diff(lastApptDate, 'days');

  const hygieneDate = lastApptDate.add(6, 'months');

  let dotStyle = styles.dot;

  if (days > 180 ) {
    dotStyle = classnames(dotStyle, styles.dotRed)
  } else if ( days < 180 && days > 60 ) {
    dotStyle = classnames(dotStyle, styles.dotYellow)
  } else {
    dotStyle = classnames(dotStyle, styles.dotGreen)
  }

  return (<div className={styles.displayFlex}>
    <div className={styles.date}>{hygieneDate.format('MMM DD YYYY')}</div>
    <div className={dotStyle}>&nbsp;</div>
  </div>
  );
}
