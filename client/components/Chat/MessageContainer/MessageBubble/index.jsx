
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import TextMessageModel from '../../../../entities/models/TextMessage';
import { isHub } from '../../../../util/hub';
import styles from './styles.scss';

function MessageBubble(props) {
  const { textMessage, isFromPatient } = props;
  const smsStatus = textMessage.get('smsStatus');
  const failedMessage = smsStatus && smsStatus === 'failed';

  const bodyClasses = classNames(styles.bubbleBody, {
    [styles.fromPatientBody]: isFromPatient,
    [styles.fromClinicBodyHub]: !isFromPatient && isHub(),
    [styles.fromClinicBody]: !isFromPatient && !isHub(),
    [styles.failedMessage]: !isFromPatient && failedMessage,
  });

  const timeClasses = classNames(styles.bubbleTime, {
    [styles.fromPatientTime]: isFromPatient,
    [styles.fromClinicTime]: !isFromPatient,
  });

  return (
    <div className={styles.bubbleWrapper}>
      <div className={bodyClasses}>{textMessage.get('body')}</div>
      <div className={timeClasses}>{moment(textMessage.get('createdAt')).format('h:mm a')}</div>
    </div>
  );
}

MessageBubble.propTypes = {
  textMessage: PropTypes.instanceOf(TextMessageModel).isRequired,
  isFromPatient: PropTypes.bool,
};

MessageBubble.defaultProps = {
  isFromPatient: true,
};

export default MessageBubble;
