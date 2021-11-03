import { OrderedMap } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextMessage from '../../../../entities/models/TextMessage';
import { resendMessage } from '../../../../thunks/chat';
import { Button } from '../../../library';
import styles from './styles.scss';

const RetryMessage = ({ message }) => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chat).get('selectedChat');
  const chatTypeStatus = useSelector((state) => state.chat).get('chatTypeStatus');
  if (!chatTypeStatus && selectedChat) {
    const chatId = selectedChat.get('id');
    const patientId = selectedChat.get('patientId');

    const id = message.get('id');

    const handleClick = () => {
      dispatch(resendMessage(id, patientId, chatId));
    };

    return (
      <div className={styles.RetryMessage}>
        <span className={styles.RetryMessage__Body}>Message not sent</span>
        <span className={styles.RetryMessage__Body__Separator}>-</span>
        <Button className={styles.RetryMessage__Link} onClick={handleClick}>
          Click to retry
        </Button>
      </div>
    );
  }
  return null;
};

RetryMessage.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.instanceOf(TextMessage),
    PropTypes.instanceOf(OrderedMap),
  ]).isRequired,
};

export default RetryMessage;
