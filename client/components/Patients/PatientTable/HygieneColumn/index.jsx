import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../styles.scss';


export default function HygieneColumn(props) {
  const {
    patient,
  } = props;

  const lastApptDate = moment(patient.lastApptDate);

  if (!lastApptDate.isValid()) {
    return null;
  }

  const hygieneDate = lastApptDate.add(9, 'months');
  const months = moment().diff(hygieneDate, 'months');

  let dotStyle = styles.dot;

  if (months >= 6) {
    dotStyle = classnames(dotStyle, styles.dotRed);
  } else if (months < 6 && months >= 0) {
    dotStyle = classnames(dotStyle, styles.dotYellow);
  } else if (months < 0 && months > -3) {
    dotStyle = classnames(dotStyle, styles.dotGreen);
  }

  return (<div className={styles.displayFlex}>
    <div className={styles.date}>{hygieneDate.format('MMM DD YYYY')}</div>
    <div className={dotStyle}>&nbsp;</div>
  </div>
  );
}

HygieneColumn.propTypes = {
  patient: PropTypes.object,
}
