import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import TextMessageModel from '../../../../entities/models/TextMessage';
import { getUTCDate } from '../../../library';
import styles from './styles.scss';

const MessageBubble = ({ isFromPatient, textMessage, timezone }) => {
  const status = textMessage.get('smsStatus');
  const hasFailed = status === 'failed';
  const bodyClasses = classNames(styles.bubbleBody, {
    [styles.fromPatientBody]: isFromPatient,
    [styles.fromClinicBodyHub]: !isFromPatient,
    [styles.fromClinicBody]: !isFromPatient,
    [styles.failedMessage]: !isFromPatient && hasFailed,
  });
  const timeClasses = classNames(styles.bubbleTime, {
    [styles.fromPatientTime]: isFromPatient,
    [styles.fromClinicTime]: !isFromPatient,
  });
  const body = textMessage.get('body');
  const time = getUTCDate(textMessage.get('createdAt'), timezone).format('h:mm a');

  const messageBubbleCompFunc = () => {
    let jsxObj;
    if (hasFailed) {
      jsxObj = (
        <div className={styles.notValidNoMessage}>
          <span className={styles.notValidNoMessage__Body}>Message not sent.</span>
        </div>
      );
    } else {
      jsxObj = `Sent - ${time}`;
    }
    return jsxObj;
  };

  return (
    <div className={styles.bubbleWrapper}>
      <div className={bodyClasses}>{body}</div>
      <div className={timeClasses}>{messageBubbleCompFunc()}</div>
    </div>
  );
};

MessageBubble.propTypes = {
  isFromPatient: PropTypes.bool,
  textMessage: PropTypes.instanceOf(TextMessageModel).isRequired,
  timezone: PropTypes.string.isRequired,
  phoneLookupObj: PropTypes.shape({
    isPhoneLookupChecked: PropTypes.bool,
    isSMSEnabled: PropTypes.bool,
    isVoiceEnabled: PropTypes.bool,
  }),
};

MessageBubble.defaultProps = {
  isFromPatient: true,
  phoneLookupObj: {},
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(MessageBubble);
