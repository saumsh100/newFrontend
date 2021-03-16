
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatPhoneNumber } from '../../../../util/isomorphic';
import { getUTCDate, Icon } from '../../../library';
import PatientPopover from '../../../library/PatientPopover';
import { patientShape } from '../../../library/PropTypeShapes';
import styles from '../styles.scss';

/**
 *  Handles formatting of unanswered and answered calls
 * @param answered
 * @param duration
 * @returns {string}
 */
const formatDuration = (answered, duration) => {
  if (!answered) {
    return 'unanswered';
  }
  return duration > 60 ? `${Math.round(duration / 60)}min ${duration % 60}sec` : `${duration}s`;
};

const CallListItem = (props) => {
  const {
    callSource,
    startTime,
    callerNum,
    callerCity,
    callerName,
    duration,
    answered,
    recording,
    index,
    patient,
    timezone,
  } = props;

  const phoneClass = answered ? styles.phone : styles.phoneMissed;
  const durationMissed = formatDuration(answered, duration);

  return (
    <div className={styles.row}>
      <div className={styles.colSmall}>{index + 1}</div>
      <div className={styles.col}>
        <Icon
          icon="phone"
          data-fa-transform="rotate-90"
          type="solid"
          size={1.3}
          className={phoneClass}
        />
        &emsp;<span className={styles.column_source}>{callSource}</span>
      </div>
      <div className={styles.col}>
        {patient ? (
          <div>
            <PatientPopover patient={patient} isPatientUser={false}>
              <div className={styles.patientStyle}>
                <div>
                  <Icon icon="user-circle" />
                </div>
                <span className={styles.callerName}>{callerName}</span>
              </div>
            </PatientPopover>
            <div className={styles.callerNum}>{formatPhoneNumber(callerNum)}</div>
          </div>
        ) : (
          <div className={styles.callerInfo}>
            <div>{callerName || 'Unknown'}</div>
            <div className={styles.callerNum}>{formatPhoneNumber(callerNum)}</div>
          </div>
        )}
      </div>
      <div className={styles.col}>{getUTCDate(startTime, timezone).format('MMM DD, h:mma')}</div>
      <div className={styles.col}>{durationMissed}</div>
      <div className={styles.col}>{callerCity}</div>
      <div className={styles.col}>
        {recording && (
          <div className={styles.volumeIcon}>
            <Icon icon="volume-up" type="solid" />
          </div>
        )}
      </div>
      <div className={styles.colEmpty} />
    </div>
  );
};

CallListItem.propTypes = {
  callSource: PropTypes.string,
  startTime: PropTypes.string,
  callerNum: PropTypes.string,
  callerCity: PropTypes.string,
  callerName: PropTypes.string,
  recording: PropTypes.string,
  duration: PropTypes.number,
  answered: PropTypes.bool,
  index: PropTypes.number,
  patient: PropTypes.shape(patientShape).isRequired,
  timezone: PropTypes.string.isRequired,
};

CallListItem.defaultProps = {
  callSource: null,
  startTime: null,
  callerNum: null,
  callerCity: null,
  callerName: null,
  recording: null,
  duration: 0,
  answered: false,
  index: 0,
};

const mapStateToProps = ({ auth }) => ({
  timezone: auth.get('timezone'),
});

export default connect(mapStateToProps, null)(CallListItem);
