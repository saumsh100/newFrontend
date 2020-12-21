
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import patientShape from '../../../library/PropTypeShapes/patient';
import { buildDotStyles } from '../helpers';
import styles from '../../PatientTable/styles.scss';
import { getUTCDate } from '../../../library';

function FollowUpsColumn({ patient, className, showTable, timezone }) {
  const { patientFollowUps } = patient;

  if (!patientFollowUps || patientFollowUps.length === 0) {
    return <div className={styles.displayFlex_text}>{showTable ? '-' : 'n/a'}</div>;
  }

  const followUpsDueDate = getUTCDate(patientFollowUps[0].dueAt, timezone);

  const dotStyle = buildDotStyles(followUpsDueDate, styles, timezone);

  return (
    <div className={styles.displayFlex}>
      <div className={`${styles.date} ${className}`}>{followUpsDueDate.format('MMM DD YYYY')}</div>
      <div className={dotStyle}>&nbsp;</div>
    </div>
  );
}

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(
  mapStateToProps,
  null,
)(FollowUpsColumn);

FollowUpsColumn.propTypes = {
  className: PropTypes.string,
  patient: PropTypes.shape(patientShape).isRequired,
  showTable: PropTypes.bool,
  timezone: PropTypes.string.isRequired,
};

FollowUpsColumn.defaultProps = {
  className: null,
  showTable: false,
};
