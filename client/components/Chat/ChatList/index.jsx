
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import PatientModel from '../../../entities/models/Patient';
import { ListItem, IconButton } from '../../library';
import ChatListItem from './ChatListItem';
import { defaultSelectedChatId, selectChat } from '../../../thunks/chat';
import { setNewChat, filterChatsByTab } from '../../../reducers/chat';
import listItemStyles from './ChatListItem/styles.scss';

class ChatListContainer extends Component {
  constructor(props) {
    super(props);

    this.removeNewChat = this.removeNewChat.bind(this);
    this.selectNewChat = this.selectNewChat.bind(this);
  }

  sortChatList() {
    const { textMessages, chats } = this.props;
    return chats.sort((a, b) => {
      if (!a.textMessages.length || !b.textMessages.length) return -1;
      const aLastId = a.textMessages[a.textMessages.length - 1];
      const aLastTm = textMessages.get(aLastId);
      const bLastId = b.textMessages[b.textMessages.length - 1];
      const bLastTm = textMessages.get(bLastId);
      if (!aLastTm || bLastTm) return -1;
      return new Date(bLastTm.createdAt) - new Date(aLastTm.createdAt);
    });
  }

  selectNewChat() {
    this.props.selectChat(null);
    this.props.onChatClick();
  }

  removeNewChat(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.setNewChat(null);
    this.props.selectChat(null);
    this.props.defaultSelectedChatId();
  }

  renderChatList() {
    return this.sortChatList().map(chat => (
      <ChatListItem key={`${chat.id}_listItem`} onChatClick={this.props.onChatClick} chat={chat} />
    ));
  }

  renderNewChat() {
    const { newChat, newChatPatient, selectedChatId } = this.props;

    if (!newChat) {
      return null;
    }

    let title = 'New message';

    if (newChat.patientId && newChatPatient) {
      title += ` to ${newChatPatient.firstName} ${newChatPatient.lastName}`;
    }

    return (
      <ListItem
        key="new"
        selectItem={!selectedChatId}
        className={listItemStyles.chatListItem}
        selectedClass={listItemStyles.selectedChatItem}
        onClick={this.selectNewChat}
      >
        <div className={listItemStyles.fullName}>{title}</div>
        <div className={listItemStyles.hoverSection}>
          <IconButton icon="times" onClick={this.removeNewChat} />
        </div>
      </ListItem>
    );
  }

  render() {
    return (
      <div>
        {this.renderNewChat()}
        {this.renderChatList()}
      </div>
    );
  }
}

ChatListContainer.propTypes = {
  textMessages: PropTypes.instanceOf(Map),
  chats: PropTypes.instanceOf(Map),
  newChat: PropTypes.shape({ patientId: PropTypes.string }),
  newChatPatient: PropTypes.instanceOf(PatientModel),
  selectedChatId: PropTypes.string,
  setNewChat: PropTypes.func.isRequired,
  defaultSelectedChatId: PropTypes.func.isRequired,
  selectChat: PropTypes.func.isRequired,
  onChatClick: PropTypes.func,
};

ChatListContainer.defaultProps = {
  textMessages: null,
  chats: null,
  newChat: null,
  newChatPatient: null,
  selectedChatId: null,
  onChatClick: e => e,
};

function mapStateToProps({ entities, chat }, { tabIndex }) {
  const newChat = chat.get('newChat');
  const selectedChat = chat.get('selectedChatId');
  const patientId = newChat && newChat.patientId;
  const textMessages = entities.getIn(['textMessages', 'models']);
  const chats = entities.getIn(['chats', 'models']);

  return {
    newChat,
    chats: filterChatsByTab(chats, textMessages, selectedChat, tabIndex),
    textMessages,
    selectedChatId: chat.get('selectedChatId'),
    newChatPatient: entities.getIn(['patients', 'models', patientId]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setNewChat,
      defaultSelectedChatId,
      selectChat,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(ChatListContainer);
