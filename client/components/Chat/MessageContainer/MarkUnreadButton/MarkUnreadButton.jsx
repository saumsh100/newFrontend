
import React from 'react';
import Proptypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Button } from '../../../library';
import { getChatCategoryCounts, markAsUnread } from '../../../../thunks/chat';
import styles from './styles.scss';

const MarkUnreadButton = ({ chatId, createdAt }) => {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(markAsUnread(chatId, createdAt));
    dispatch(getChatCategoryCounts());
  };

  return (
    <Button className={styles.MarkUnreadButton} data-test-id="chat_markUnreadBtn" onClick={onClick}>
      Mark unread
    </Button>
  );
};

MarkUnreadButton.propTypes = {
  chatId: Proptypes.string.isRequired,
  createdAt: Proptypes.string.isRequired,
};

export default MarkUnreadButton;
