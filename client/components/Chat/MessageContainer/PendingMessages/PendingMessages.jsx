
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInterval from '../../../../hooks/useInterval';
import { prunePendingMessages } from '../../../../reducers/chat';
import PendingMessage from '../PendingMessage';

const PendingMessages = () => {
  const dispatch = useDispatch();
  const pendingMessages = useSelector(state => state.chat.get('pendingMessages'));
  const chatId = useSelector(state => state.chat.get('selectedChatId'));
  let aMomentAgo = moment().subtract(10, 'seconds');

  useInterval(() => {
    aMomentAgo = moment().subtract(10, 'seconds');
    dispatch(prunePendingMessages());
  }, 10000);

  return pendingMessages
    .filter(pending => pending.chatId === chatId)
    .filter(pending => moment(pending.addedAt).isAfter(aMomentAgo))
    .map(pending => (
      <PendingMessage key={`${pending.addedAt}-${pending.message}`} body={pending.message} />
    ));
};

export default PendingMessages;
