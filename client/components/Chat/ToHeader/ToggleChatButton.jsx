
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '../../library';
import styles from './styles.scss';

export default function ToggleChatButton({ toggleChat, isChatOpen }) {
  return (
    <div
      className={styles.toggleChatWrapper}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.keyCode === 13 && toggleChat()}
      onClick={toggleChat}
    >
      {isChatOpen ? (
        <>
          <Icon className={styles.toggleIcon} icon="check" />
          <span>Close</span>
        </>
      ) : (
        <>
          <Icon className={classNames(styles.toggleIcon, styles.redoIcon)} icon="redo-alt" />
          <span>Reopen</span>
        </>
      )}
    </div>
  );
}

ToggleChatButton.propTypes = {
  toggleChat: PropTypes.func.isRequired,
  isChatOpen: PropTypes.bool.isRequired,
};
