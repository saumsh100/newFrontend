
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

  const bodyClasses = classNames(
    isFromPatient ? styles.fromPatientBody : styles.fromClinicBody,
    styles.bubbleBody,
  );

  const timeClasses = classNames(
    isFromPatient ? styles.fromPatientTime : styles.fromClinicTime,
    styles.bubbleTime,
  );

  return (
    <div
      className={styles.bubbleWrapper}
    >
      <div className={bodyClasses}>
        {textMessage.get('body')}
      </div>
      <div className={timeClasses}>
        {moment(textMessage.get('createdAt')).format('h:mm a')}
      </div>
    </div>
  );
}

MessageBubble.propTypes = {
  textMessage: PropTypes.shape({
    body: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  isFromPatient: PropTypes.bool,
};

export default MessageBubble;
