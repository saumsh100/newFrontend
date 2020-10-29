
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import Avatar from '../../../library/Avatar';
import styles from './styles.scss';

const PendingMessage = ({ body }) => {
  const user = useSelector(state => state.auth.get('user')).toJS();

  return (
    <div className={styles.PendingMessageWrapper}>
      <Avatar className={styles.PendingMessage__Avatar} isPatient={false} size="xs" user={user} />
      <div className={styles.PendingMessage}>
        <div className={styles.PendingMessage__Body}>{body}</div>
        <div className={styles.PendingMessage__Status}>Sending...</div>
      </div>
    </div>
  );
};

PendingMessage.propTypes = {
  body: PropTypes.string.isRequired,
};

export default PendingMessage;
