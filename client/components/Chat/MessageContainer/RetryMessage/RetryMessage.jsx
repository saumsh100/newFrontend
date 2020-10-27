
import { OrderedMap } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextMessage from '../../../../entities/models/TextMessage';
import { addPendingMessage } from '../../../../reducers/chat';
import { resendMessage } from '../../../../thunks/chat';
import { Button } from '../../../library';
import styles from './styles.scss';

const RetryMessage = ({ message }) => {
  const dispatch = useDispatch();
  const selectedChat = useSelector(state => state.chat).get('selectedChat');
  const auth = useSelector(state => state.auth);
  const entities = useSelector(state => state.entities);
  const chatId = selectedChat.get('id');
  const patientId = selectedChat.get('patientId');
  const id = message.get('id');
  const selectedPatient = entities.getIn(['patients', 'models']).get(patientId);

  const handleClick = () => {
    dispatch(
      addPendingMessage({
        addedAt: Date.now(),
        chatId,
        id,
        message: message.get('body'),
        patient: {
          accountId: entities.getIn(['accounts', 'models', auth.get('accountId')]).id,
          cellPhoneNumber: selectedPatient.cellPhoneNumber,
          id: selectedPatient.id,
        },
        userId: auth.getIn(['user', 'id']),
      }),
    );
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
};

RetryMessage.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.instanceOf(TextMessage),
    PropTypes.instanceOf(OrderedMap),
  ]).isRequired,
};

export default RetryMessage;
