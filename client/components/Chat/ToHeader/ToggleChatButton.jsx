import React from 'react';
import PropTypes from 'prop-types';
import { StandardButton } from '../../library';
import styles from './styles.scss';

export default function ToggleChatButton({ toggleChat, isChatOpen }) {
  return (
    <div className={styles.toggleChatWrapper} role="button" tabIndex={0}>
      {isChatOpen ? (
        <StandardButton variant="primary" onClick={toggleChat} title="Close" icon="check" />
      ) : (
        <StandardButton variant="primary" onClick={toggleChat} title="Reopen" icon="redo-alt" />
      )}
    </div>
  );
}

ToggleChatButton.propTypes = {
  toggleChat: PropTypes.func.isRequired,
  isChatOpen: PropTypes.bool.isRequired,
};
