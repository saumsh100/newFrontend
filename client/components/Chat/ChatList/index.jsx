
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Icon,
  ListItem,
} from '../../library';
import ChatListItem from './ChatListItem';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import { defaultSelectedChatId } from '../../../thunks/chat';
import { setNewChat, setSelectedChatId } from '../../../reducers/chat';
import listItemStyles from './ChatListItem/styles.scss';
import styles from './styles.scss';

class ChatListContainer extends Component {
  constructor(props) {
    super(props);

    this.removeNewChat = this.removeNewChat.bind(this);
    this.selectNewChat = this.selectNewChat.bind(this);
    this.setPatient = this.setPatient.bind(this);
    this.toggleIsFlagged = this.toggleIsFlagged.bind(this);
  }

  removeNewChat(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.setNewChat(null);
    this.props.setSelectedChatId(null);
    this.props.defaultSelectedChatId();
  }

  selectNewChat() {
    this.props.setSelectedChatId(null);
  }

  setPatient(id, chatId) {
    this.props.onClick(id, chatId);
    this.props.updateEntityRequest({ key: 'textMessages', values: {}, url: `/api/chats/${chatId}/textMessages/read` });
  }

  toggleIsFlagged(chat) {
    this.props.updateEntityRequest({
      key: 'chats',
      values: { isFlagged: !chat.isFlagged },
      url: `/api/chats/${chat.id}`,
      merge: true,
    });
  }

  render() {
    const {
      chats,
      patients,
      textMessages,
      selectedChat,
      newChat,
      newChatPatient,
      filterIndex,
    } = this.props;

    let title = 'New message';
    if (newChat && newChat.patientId && newChatPatient) {
      title += ` to ${newChatPatient.firstName} ${newChatPatient.lastName}`;
    }

    // TODO: move into a selector for re-render efficiency
    let sortedChats = chats.toArray().sort((a, b) => {
      return new Date(b.lastTextMessageDate) - new Date(a.lastTextMessageDate);
    });

    if (filterIndex) {
      if (filterIndex === 1) {
        sortedChats = sortedChats.filter((chat) => {
          const lastTextMessageId = chat.textMessages[chat.textMessages.length - 1];
          return !textMessages.get(lastTextMessageId).read;
        });
      } else if (filterIndex === 2) {
        sortedChats = sortedChats.filter((chat) => {
          return chat.isFlagged;
        });

        console.log(sortedChats.length);
      }
    }

    // based on tabs index from parent component, now filter the chats
    return (
      <div>
        {newChat ?
          <ListItem
            selectItem={!(selectedChat && selectedChat)}
            className={listItemStyles.chatListItem}
            selectedClass={listItemStyles.selectedChatItem}
            onClick={this.selectNewChat}
          >
            <div className={listItemStyles.fullName}>
              {title}
            </div>
            <div
              onClick={this.removeNewChat}
              className={listItemStyles.hoverSection}
            >
              <Icon
                icon="times"
              />
            </div>
          </ListItem> : null}
        {sortedChats.map((chat) => {
          const lastTextMessageId = chat.textMessages[chat.textMessages.length - 1];
          const lastTextMessage = textMessages.get(lastTextMessageId);
          const patient = patients.get(chat.patientId);

          // A fix for when we create chat, but still haven't sent the textMessage yet
          if (!patient || !lastTextMessage) {
            return null;
          }

          return (
            <ChatListItem
              key={`${chat.id}_listItem`}
              chat={chat}
              patient={patient}
              lastTextMessage={lastTextMessage}
              isActive={selectedChat && (selectedChat.id === chat.id)}
              onSelect={() => this.setPatient(patient.id, chat.id)}
              onToggleFlag={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleIsFlagged(chat);
              }}
            />
          );
        })}
      </div>
    );
  }
}

ChatListContainer.propTypes = {
  textMessages: PropTypes.object,
  chats: PropTypes.object,
  selectedChat: PropTypes.object,
  activeAccount: PropTypes.object,
  currentPatient: PropTypes.object,
  patients: PropTypes.object,
  updateEntityRequest: PropTypes.func.isRequired,
  newChat: PropTypes.object,
  filterIndex: PropTypes.number.isRequired,
};

function mapStateToProps({ entities }, { newChat }) {
  const patientId = newChat && newChat.patientId;
  return {
    activeAccount: entities.getIn(['accounts', 'models']).first(),
    newChatPatient: entities.getIn(['patients', 'models', patientId]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
    setNewChat,
    setSelectedChatId,
    defaultSelectedChatId,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ChatListContainer);
