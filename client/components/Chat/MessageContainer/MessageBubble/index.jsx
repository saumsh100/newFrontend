
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import TextMessageModel from '../../../../entities/models/TextMessage';
import { isHub } from '../../../../util/hub';
import RetryMessage from '../RetryMessage/RetryMessage';
import styles from './styles.scss';

const MessageBubble = ({ isFromPatient, textMessage }) => {
  const status = textMessage.get('smsStatus');
  const hasFailed = status === 'failed';
  const bodyClasses = classNames(styles.bubbleBody, {
    [styles.fromPatientBody]: isFromPatient,
    [styles.fromClinicBodyHub]: !isFromPatient && isHub(),
    [styles.fromClinicBody]: !isFromPatient && !isHub(),
    [styles.failedMessage]: !isFromPatient && hasFailed,
  });
  const timeClasses = classNames(styles.bubbleTime, {
    [styles.fromPatientTime]: isFromPatient,
    [styles.fromClinicTime]: !isFromPatient,
  });
  const body = textMessage.get('body');
  const time = moment(textMessage.get('createdAt')).format('h:mm a');

  return (
    <div className={styles.bubbleWrapper}>
      <div className={bodyClasses}>{body}</div>
      <div className={timeClasses}>
        {hasFailed ? <RetryMessage message={textMessage} /> : `Sent - ${time}`}
      </div>
    </div>
  );
};

MessageBubble.propTypes = {
  isFromPatient: PropTypes.bool,
  textMessage: PropTypes.instanceOf(TextMessageModel).isRequired,
};

MessageBubble.defaultProps = {
  isFromPatient: true,
};

export default MessageBubble;
