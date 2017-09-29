
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Avatar, Icon } from '../../library';
import styles from '../styles.scss';

export default function CallerDisplayUnknown(props) {
  const {
    call,
    clearSelectedChat,
  } = props;

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

  const callDisplayContainer = classnames(styles.callDisplayContainer, borderStyling);

  return (
    <div className={callDisplayContainer} >
      <div className={styles.headerContainerUnknown}>
        <Icon size={5} className={styles.callerAvatarUnknown} icon="question-circle" />
        <div
          className={styles.closeIcon}
          onClick={clearSelectedChat}
        >
          x
        </div>
      </div>
      <div className={styles.callBody}>
        <div className={styles.iconContainer} >
          <Icon size={2} icon="phone" />
        </div>
        <div className={styles.callInfo_header} >Call Information</div>
        <div className={styles.callInfo}>
          <div className={styles.callInfo_content}>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>Number: </div>
              <div className={styles.callInfo_data}>{call.callerNum}</div>
            </div>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>City: </div>
              <div className={styles.callInfo_data}>{call.callerCity}</div>
            </div>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>Country: </div>
              <div className={styles.callInfo_data}>{call.callerCountry}</div>
            </div>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>State: </div>
              <div className={styles.callInfo_data}>{call.callerState}</div>
            </div>
          </div>
          <div className={styles.callInfo_content2}>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>Zip: </div>
              <div className={styles.callInfo_data}>{call.callerZip}</div>
            </div>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>Duration: </div>
              <div className={styles.callInfo_data}>{call.duration}</div>
            </div>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>Source: </div>
              <div className={styles.callInfo_data}>{call.callSource}</div>
            </div>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>Total Calls: </div>
              <div className={styles.callInfo_data}>{call.totalCalls}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CallerDisplayUnknown.propTypes = {
  call: PropTypes.object,
  clearSelectedChat: PropTypes.func,
};
