
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { unlockChat } from '../../../../thunks/chat';
import styles from './styles.scss';

class ReadAllBar extends Component {
  unlockChat() {
    const { selectedChatId } = this.props;
    this.props.unlockChat(selectedChatId);
  }

  render() {
    const { selectedChatId, lockedChats } = this.props;

    if (!lockedChats.includes(selectedChatId)) {
      return null;
    }

    return (
      <div className={styles.barStyle}>
        <span>Messages marked as unread.</span>
        <span className={styles.markRead} onClick={this.unlockChat.bind(this)}>
          Mark as read
        </span>
      </div>
    );
  }
}

ReadAllBar.propTypes = {
  lockedChats: PropTypes.arrayOf(PropTypes.string),
  selectedChatId: PropTypes.string,
  lockChat: PropTypes.func,
};

function mapStateToProps({ chat }) {
  const lockedChats = chat.get('lockedChats');

  return {
    lockedChats,
    selectedChatId: chat.get('selectedChatId'),
    lockedChatsLength: lockedChats.length,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      unlockChat,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(ReadAllBar);
