
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import styles from './styles.scss';

function MessageBubble(props) {
  const {
    textMessage,
    isFromPatient,
  } = props;

  let bodyClasses = classNames(
    isFromPatient ? styles.fromPatientBody : styles.fromClinicBody,
    styles.bubbleBody,
  );

  let timeClasses = classNames(
    isFromPatient ? styles.fromPatientTime : styles.fromClinicTime,
    styles.bubbleTime,
  );

  return (
    <div
      className={styles.bubbleWrapper}
    >
      <div className={bodyClasses}>
        {textMessage.body}
      </div>
      <div className={timeClasses}>
        {moment(textMessage.createdAt).format('h:mm a')}
      </div>
    </div>
  );
}

MessageBubble.propTypes = {

};

export default MessageBubble;
