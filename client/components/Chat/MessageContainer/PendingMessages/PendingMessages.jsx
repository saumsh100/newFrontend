
import { isImmutable } from 'immutable';
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
  const chatMessages = useSelector(state => state.chat.get('chatMessages'));
  const recentTexts = isImmutable(chatMessages)
    ? chatMessages
      .toArray()
      .map(text => text.toJS())
      .filter(text => moment(text.createdAt).isAfter(moment().subtract(1, 'minute')))
    : [];

  useInterval(() => {
    dispatch(prunePendingMessages());
  }, 15000);

  return pendingMessages
    .filter(pending => pending.chatId === chatId)
    .filter(pending => moment(pending.addedAt).isAfter(moment().subtract(1, 'minute')))
    .filter(
      pending =>
        (Boolean(pending.id) && recentTexts.every(recent => recent.id !== pending.id)) || true,
    )
    .filter(pending => recentTexts.every(text => text.body !== pending.message))
    .map(pending => (
      <PendingMessage key={`${pending.addedAt}-${pending.message}`} body={pending.message} />
    ));
};

export default PendingMessages;
