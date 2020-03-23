
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import PatientModel from '../../../entities/models/Patient';
import { ListItem, Avatar, Icon } from '../../library';
import ChatListItem from './ChatListItem';
import { defaultSelectedChatId, selectChat } from '../../../thunks/chat';
import { filterChatsByTab } from '../../../reducers/chat';
import { sortByFieldAsc } from '../../library/util/SortEntities';
import listItemStyles from './ChatListItem/styles.scss';

class ChatListContainer extends Component {
  constructor(props) {
    super(props);

    this.removeNewChat = this.removeNewChat.bind(this);
    this.selectNewChat = this.selectNewChat.bind(this);
  }

  sortChatList() {
    const { chats } = this.props;
    return sortByFieldAsc(chats, 'lastTextMessageDate').toArray();
  }

  selectNewChat() {
    this.props.selectChat(null);
    this.props.onChatClick();
  }

  removeNewChat(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.selectChat(null, null);
    this.props.defaultSelectedChatId();
  }

  renderChatList() {
    return this.sortChatList()
      .filter(chat =>
        !chat.patient)
      .map(chat =>
        (
        <ChatListItem
          key={`${chat.id}_listItem`}
          onChatClick={this.props.onChatClick}
          chat={chat}
        />
        ));
  }

  renderNewChat() {
    const { newChat, newChatPatient, selectedChatId } = this.props;

    if (!newChat) {
      return null;
    }
    const isNewPatientChat = newChat.patientId && newChatPatient;
    const title = isNewPatientChat
      ? `${newChatPatient.getFullName()}, ${newChatPatient.getAge()}`
      : 'New message';
    const patient = isNewPatientChat ? newChatPatient : { isUnknown: true };

    return (
      <ListItem
        key="new"
        selectItem={!selectedChatId}
        className={classNames(listItemStyles.chatListItem)}
        selectedClass={listItemStyles.selectedChatItem}
        onClick={this.selectNewChat}
      >
        <div className={listItemStyles.timesIcon}>
          <Icon
            icon="times"
            onClick={this.removeNewChat}
            onKeyDown={({ keyCode }) =>
keyCode === 13 && this.removeNewChat}
            role="button"
            tabIndex={0}
          />
        </div>
        <div className={listItemStyles.avatar}>
          <Avatar size="sm" user={patient} />
        </div>
        <div className={listItemStyles.flexSection}>
          <div className={listItemStyles.topSection}>
            <div className={listItemStyles.fullName}>{title}</div>
          </div>
          {isNewPatientChat && (
            <div data-test-id="chat_lastMessage" className={listItemStyles.bottomSection}>
              New Message
            </div>
          )}
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
  chats: PropTypes.instanceOf(Map),
  newChat: PropTypes.shape({ patientId: PropTypes.string }),
  newChatPatient: PropTypes.instanceOf(PatientModel),
  selectedChatId: PropTypes.string,
  defaultSelectedChatId: PropTypes.func.isRequired,
  selectChat: PropTypes.func.isRequired,
  onChatClick: PropTypes.func,
};

ChatListContainer.defaultProps = {
  chats: null,
  newChat: null,
  newChatPatient: null,
  selectedChatId: null,
  onChatClick: e =>
    e,
};

function mapStateToProps({ entities, chat }, { tabIndex }) {
  const newChat = chat.get('newChat');
  const selectedChat = chat.get('selectedChatId');
  const patientId = newChat && newChat.patientId;
  const chats = entities.getIn(['chats', 'models']);

  return {
    newChat,
    chats: filterChatsByTab(chats, selectedChat, tabIndex),
    selectedChatId: chat.get('selectedChatId'),
    newChatPatient: entities.getIn(['patients', 'models', patientId]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
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
