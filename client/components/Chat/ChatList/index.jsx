
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import PatientModel from '../../../entities/models/Patient';
import { ListItem, IconButton } from '../../library';
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
      .filter(chat => !chat.patient)
      .map(chat => (
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

    let title = 'New message';

    if (newChat.patientId && newChatPatient) {
      title += ` to ${newChatPatient.firstName} ${newChatPatient.lastName}`;
    }

    return (
      <ListItem
        key="new"
        selectItem={!selectedChatId}
        className={classNames(listItemStyles.newChat, listItemStyles.chatListItem)}
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
