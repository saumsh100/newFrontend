
import React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import useInterval from '../../../../hooks/useInterval';
import { prunePendingMessages } from '../../../../reducers/chat';
import PendingMessage from '../PendingMessage';
import { getTodaysDate, getUTCDate } from '../../../library';

const PendingMessages = ({ timezone }) => {
  const dispatch = useDispatch();
  const pendingMessages = useSelector(state => state.chat.get('pendingMessages'));
  const chatId = useSelector(state => state.chat.get('selectedChatId'));
  let aMomentAgo = getTodaysDate(timezone).subtract(10, 'seconds');

  useInterval(() => {
    aMomentAgo = getTodaysDate(timezone).subtract(10, 'seconds');
    dispatch(prunePendingMessages());
  }, 10000);

  return pendingMessages
    .filter(pending => pending.chatId === chatId)
    .filter(pending => getUTCDate(pending.addedAt, timezone).isAfter(aMomentAgo))
    .map(pending => (
      <PendingMessage key={`${pending.addedAt}-${pending.message}`} body={pending.message} />
    ));
};

PendingMessages.propTypes = {
  timezone: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(PendingMessages);
