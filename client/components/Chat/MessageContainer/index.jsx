
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { OrderedMap } from 'immutable';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import classNames from 'classnames';
import moment from 'moment';
import {
  Avatar,
  SContainer,
  SBody,
  SFooter,
  Icon,
  Tooltip,
  Button,
  InfiniteScroll,
} from '../../library';
import MessageBubble from './MessageBubble';
import MessageTextArea from './MessageTextArea';
import {
  sendChatMessage,
  createNewChat,
  selectChat,
  markAsUnread,
  resendMessage,
  loadChatMessages,
  getChatCategoryCounts,
} from '../../../thunks/chat';
import ChatTextMessage from '../../../entities/models/TextMessage';
import chatTabs from '../consts';
import UnknownPatient from '../unknownPatient';
import styles from './styles.scss';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 15;

class MessageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentlySelectedChat: null,
      sendingMessage: false,
      loadingMessages: false,
      offset: DEFAULT_OFFSET,
      loadedMessages: 0,
    };

    this.scrollContainer = createRef();
    this.optionsWrapper = createRef();
    this.failedMessageWrapper = createRef();
    this.sendMessageHandler = this.sendMessageHandler.bind(this);
    this.loadMoreMessages = this.loadMoreMessages.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { selectedChat, textMessages } = props;
    const { loadedMessages, currentlySelectedChat } = state;

    // Different chatId
    if (selectedChat && selectedChat.id && currentlySelectedChat !== selectedChat.id) {
      return {
        loadedMessages: 0, // reset pagination to default
        offset: DEFAULT_OFFSET, // reset pagination to default
        currentlySelectedChat: selectedChat.id,
      };
    }

    // Different amount of loaded messages
    if (textMessages.size && textMessages.size !== loadedMessages) {
      return {
        loadedMessages: textMessages.size,
        loadingMessages: false,
      };
    }

    return null;
  }

  componentDidMount() {
    this.scrollContainer.current.scrollTop = this.scrollContainer.current.scrollHeight;
  }

  componentDidUpdate() {
    // Scroll down on component
    const node = this.scrollContainer.current;
    if (node && node.scrollTop !== node.scrollHeight) {
      node.scrollTop = node.scrollHeight;
    }
  }

  getMessageTime(message) {
    return moment(message).calendar(null, {
      sameDay: '[Today], h:mm a',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday], h:mm a',
      lastWeek: '[Last] dddd h:mm a',
      sameElse: 'YYYY/MM/DD, h:mm a',
    });
  }

  loadMoreMessages() {
    const { selectedChat, textMessages } = this.props;
    if (!selectedChat || !selectedChat.id) {
      return;
    }

    this.setState(
      {
        offset: textMessages.size,
        loadingMessages: true,
      },
      () => {
        const { offset } = this.state;
        this.props.loadChatMessages(selectedChat.id, offset, DEFAULT_LIMIT).then(() => {
          this.setState({ loadingMessages: false });
        });
      },
    );
  }

  sendMessageHandler(values) {
    if (this.state.sendingMessage) return;

    this.setState({ sendingMessage: true });

    const accountId = this.props.activeAccount.id;
    const { selectedPatient, selectedChat, userId } = this.props;
    const { cellPhoneNumber } = selectedPatient;

    if (!values.message) return;

    const patient = {
      id: this.props.selectedPatient.id,
      cellPhoneNumber,
      accountId,
    };

    const requestObject = {
      message: values.message,
      patient,
      userId,
    };

    if (selectedChat && selectedChat.id) {
      requestObject.chatId = selectedChat.id;
    }

    if (!requestObject.chatId) {
      this.createNewChat(requestObject)
        .then((chat) => {
          requestObject.chatId = Object.keys(chat.chats)[0];
          return this.sendMessage(requestObject);
        })
        .then(() => {
          this.props.selectChat(requestObject.chatId);
          this.props.setTab(chatTabs.ALL_TAB);
          this.props.reset('chatMessageForm_newChat');
          this.setState({ sendingMessage: false });
        })
        .catch(() => {
          this.setState({ sendingMessage: false });
        });
      return;
    }

    this.sendMessage(requestObject)
      .then(() => this.props.reset(`chatMessageForm_${selectedChat.id}`))
      .then(() => this.setState({ sendingMessage: false }))
      .then(() => {
        this.props.selectChat(selectedChat.id);
      })
      .catch(() => this.setState({ sendingMessage: false }));
  }

  sendMessage(request) {
    return this.props.sendChatMessage(request);
  }

  createNewChat(request) {
    return this.props.createNewChat(request);
  }

  isWithinTimePeriod(startDate, testingDate, maxIntervalValue = 1, maxIntervalUnit = 'hours') {
    const firstDate = moment(startDate);
    const secondDate = moment(testingDate);
    return firstDate.diff(secondDate, maxIntervalUnit) > -Math.abs(maxIntervalValue);
  }

  groupChatMessages(textMessages) {
    const group = [];
    let currentGroup = { messages: [] };

    textMessages.forEach((message) => {
      if (!currentGroup.time) {
        currentGroup.time = message.createdAt;
      }

      if (currentGroup.messages.length === 0) {
        return currentGroup.messages.push(message);
      }

      if (!this.isWithinTimePeriod(currentGroup.time, message.createdAt)) {
        group.push(currentGroup);

        currentGroup = {
          time: message.createdAt,
          messages: [],
        };
      }

      return currentGroup.messages.push(message);
    });

    group.push(currentGroup);
    return group;
  }

  renderMessageGroup(messages) {
    const { selectedPatient } = this.props;
    const activeAccount = this.props.activeAccount.toJS();
    const accountTwilio = activeAccount.twilioPhoneNumber;
    const botAvatar = {
      fullAvatarUrl: '/images/donna.png',
      bot: true,
    };

    return messages.map((message) => {
      const isFromPatient = message.get('from') !== accountTwilio;
      const patientId = !isEmpty(selectedPatient) ? selectedPatient.get('id') : null;

      const dotsIcon = (
        <Icon icon="ellipsis-h" size={2} className={styles.dotsIcon} id={`dots_${message.id}`} />
      );

      const markUnreadText = (
        <Button
          className={styles.markUnreadButton}
          data-test-id="chat_markUnreadBtn"
          onClick={() => {
            this.props.markAsUnread(message.get('chatId'), message.get('createdAt'));
            this.props.getChatCategoryCounts();
          }}
        >
          Mark unread
        </Button>
      );

      const resendMessageButton = (
        <Button
          className={styles.markUnreadButton}
          onClick={() =>
            this.props.resendMessage(message.get('id'), patientId, message.get('chatId'))
          }
        >
          Failed to send message, click to retry.
        </Button>
      );

      let avatarUser = selectedPatient;

      if (!isFromPatient) {
        avatarUser = message.user && message.user.id ? message.user : botAvatar;
      }

      const isBot = avatarUser && avatarUser.bot;
      const avatarStyles = classNames(styles.bubbleAvatar, { [styles.botAvatar]: isBot });

      const avatar = (
        <Avatar size="xs" className={avatarStyles} user={avatarUser} isPatient={isFromPatient} />
      );

      const failedMessage = message.get('smsStatus') === 'failed' && (
        <div className={styles.failedMessage} ref={this.failedMessageWrapper}>
          <Tooltip
            trigger={['hover']}
            overlay={resendMessageButton}
            placement="left"
            getTooltipContainer={() => this.failedMessageWrapper.current}
          >
            <div>
              <Icon className={styles.failedMessageWarning} icon="exclamation-circle" size={2} />
            </div>
          </Tooltip>
        </div>
      );

      const messageOptions = isFromPatient && (
        <div
          className={styles.dotsWrapper}
          data-test-id="chat_unreadDots"
          ref={this.optionsWrapper}
        >
          <Tooltip
            trigger={['hover']}
            overlay={markUnreadText}
            placement="right"
            getTooltipContainer={() => this.optionsWrapper.current}
          >
            <div className={styles.dotsIconWrapper}>{dotsIcon}</div>
          </Tooltip>
        </div>
      );

      return (
        <div key={message.id} data-test-id="item_chatMessage" className={styles.messageWrapper}>
          <div
            key={message.get('id')}
            className={isFromPatient ? styles.patientMessage : styles.clinicMessage}
          >
            {isFromPatient && avatar}
            {failedMessage}
            <MessageBubble textMessage={message} isFromPatient={isFromPatient} />
            {!isFromPatient && avatar}
            {messageOptions}
          </div>
        </div>
      );
    });
  }

  renderMessagesTree() {
    const { textMessages } = this.props;

    return this.groupChatMessages(textMessages).map((group, index) => {
      const headingContent =
        group.messages.length !== 0 ? this.getMessageTime(group.time) : 'No messages';

      return (
        <div className={styles.groupWrapper} key={group.time || index}>
          <div className={styles.time}>{headingContent}</div>
          <div>{this.renderMessageGroup(group.messages)}</div>
        </div>
      );
    });
  }

  render() {
    const { loadingMessages, loadedMessages } = this.state;
    const { selectedChat, newChat, totalChatMessages } = this.props;

    const hasMoreMessages = totalChatMessages > loadedMessages;
    const chat = selectedChat || Object.assign({}, newChat, { id: 'newChat' });

    return (
      <SContainer className={styles.messageContainer}>
        <SBody
          id="careCruChatScrollIntoView"
          className={styles.allMessages}
          refCallback={this.scrollContainer}
        >
          <InfiniteScroll
            isReverse
            initialLoad={false}
            useWindow={false}
            loadMore={this.loadMoreMessages}
            hasMore={hasMoreMessages && !loadingMessages}
            threshold={100}
          >
            {selectedChat && this.renderMessagesTree()}
            <div className={styles.raise} />
          </InfiniteScroll>
        </SBody>
        <SFooter className={styles.sendMessage}>
          <MessageTextArea
            chat={chat}
            selectChatOrCreate={this.props.selectChatOrCreate}
            sendingMessage={this.state.sendingMessage}
            onSendMessage={this.sendMessageHandler}
          />
        </SFooter>
      </SContainer>
    );
  }
}

function mapStateToProps({ entities, auth, chat }) {
  const chats = entities.getIn(['chats', 'models']);
  const patients = entities.getIn(['patients', 'models']);
  const selectedChatId = chat.get('selectedChatId');
  const selectedChat = chats.get(selectedChatId) || chat.get('newChat');
  const prospect = chat.get('prospect');
  const textMessages = chat.get('chatMessages');
  const totalChatMessages = chat.get('totalChatMessages');
  const getPatient = ({ patientId, patientPhoneNumber }) =>
    (patientId ? patients.get(patientId) : UnknownPatient(patientPhoneNumber, prospect));
  const selectedPatient = (selectedChat && getPatient(selectedChat)) || {};

  return {
    textMessages,
    selectedChat,
    totalChatMessages,
    selectedPatient,
    newChat: chat.get('newChat'),
    userId: auth.getIn(['user', 'id']),
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectChat,
      reset,
      sendChatMessage,
      createNewChat,
      markAsUnread,
      resendMessage,
      loadChatMessages,
      getChatCategoryCounts,
    },
    dispatch,
  );
}

MessageContainer.propTypes = {
  textMessages: PropTypes.oneOfType([
    PropTypes.arrayOf(ChatTextMessage),
    PropTypes.instanceOf(OrderedMap),
  ]).isRequired,
  activeAccount: PropTypes.shape({
    id: PropTypes.string,
    twilioPhoneNumber: PropTypes.string,
    toJS: PropTypes.func,
  }).isRequired,
  selectedChat: PropTypes.shape({ id: PropTypes.string }),
  newChat: PropTypes.shape({ id: PropTypes.string }),
  selectedPatient: PropTypes.shape({ id: PropTypes.string }),
  userId: PropTypes.string.isRequired,
  totalChatMessages: PropTypes.number.isRequired,
  selectChatOrCreate: PropTypes.func.isRequired,
  selectChat: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  sendChatMessage: PropTypes.func.isRequired,
  createNewChat: PropTypes.func.isRequired,
  markAsUnread: PropTypes.func.isRequired,
  resendMessage: PropTypes.func.isRequired,
  setTab: PropTypes.func.isRequired,
  loadChatMessages: PropTypes.func.isRequired,
  getChatCategoryCounts: PropTypes.func.isRequired,
};

MessageContainer.defaultProps = {
  selectedPatient: null,
  newChat: null,
  selectedChat: null,
};

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(MessageContainer);
