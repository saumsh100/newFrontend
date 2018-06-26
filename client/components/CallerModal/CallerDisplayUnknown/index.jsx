
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Avatar, Icon } from '../../library';
import AppointmentBookedToggle from '../CallerDisplay/AppointmentBookedToggle';
import CallDisplayInfo from '../CallDisplayInfo';
import styles from '../styles.scss';

export default function CallerDisplayUnknown(props) {
  const { call, clearSelectedCall, updateEntityRequest } = props;

  const isAnswered = call.answered;
  const isCallFinished = call.duration > 0;

  let borderStyling = null;
  if (!isAnswered && !isCallFinished) {
    // call incoming
    borderStyling = styles.incoming;
  } else if (isCallFinished && isAnswered) {
    // call ended
    borderStyling = styles.ended;
  } else {
    // call missed
    borderStyling = styles.missed;
  }

  const callDisplayContainer = classnames(
    styles.callDisplayContainer,
    borderStyling,
  );

  return (
    <div className={callDisplayContainer}>
      <div className={styles.headerContainerUnknown}>
        <div className={styles.callerAvatarUnknown}>
          <span> ? </span>
        </div>{' '}
        }
        <div className={styles.closeIcon} onClick={clearSelectedCall}>
          <Icon icon="times" />
        </div>
      </div>
      <div className={styles.callBody}>
        <div className={styles.patientInfoContainerUnknown}>
          <div className={styles.patientNameAge}>
            <span>Unknown Caller</span>
          </div>
        </div>
        <div className={styles.iconContainer}>
          <Icon size={2} icon="phone" />
        </div>
        <div className={styles.callInfo_header}>Call Information</div>

        <CallDisplayInfo call={call} />

        <AppointmentBookedToggle
          call={call}
          updateEntityRequest={updateEntityRequest}
        />
      </div>
    </div>
  );
}

CallerDisplayUnknown.propTypes = {
  call: PropTypes.object,
  clearSelectedCall: PropTypes.func,
  updateEntityRequest: PropTypes.func,
};
