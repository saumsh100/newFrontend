import { OrderedMap } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import ChatTextMessage from '../../../entities/models/TextMessage';
import {
  createNewChat,
  getChatCategoryCounts,
  loadChatMessages,
  markAsUnread,
  selectChat,
  sendChatMessage,
} from '../../../thunks/chat';
import {
  Avatar,
  getUTCDate,
  Icon,
  InfiniteScroll,
  SBody,
  SContainer,
  SFooter,
  Tooltip,
} from '../../library';
import chatTabs from '../consts';
import UnknownPatient from '../unknownPatient';
import MarkUnreadButton from './MarkUnreadButton/MarkUnreadButton';
import MessageBubble from './MessageBubble';
import MessageTextArea from './MessageTextArea';
import PendingMessages from './PendingMessages/PendingMessages';
import styles from './styles.scss';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 15;

const getMessageTime = (message, timezone) =>
  getUTCDate(message, timezone).calendar(null, {
    sameDay: '[Today], h:mm a',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday], h:mm a',
    lastWeek: '[Last] dddd h:mm a',
    sameElse: 'YYYY/MM/DD, h:mm a',
  });

const isWithinTimePeriod = (
  startDate,
  testingDate,
  timezone,
  maxIntervalValue = 1,
  maxIntervalUnit = 'hours',
) =>
  getUTCDate(startDate, timezone).diff(getUTCDate(testingDate, timezone), maxIntervalUnit) >
  -Math.abs(maxIntervalValue);

const botAvatar = {
  fullAvatarUrl: '/images/donna.png',
  bot: true,
};

class MessageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlySelectedChat: null,
      sendingMessage: false,
      loadingMessages: false,
      offset: DEFAULT_OFFSET,
      loadedMessages: 0,
      scrolled: false,
    };
    this.scrollContainer = createRef();
    this.optionsWrapper = createRef();
    this.failedMessageWrapper = createRef();
    this.sendMessageHandler = this.sendMessageHandler.bind(this);
    this.loadMoreMessages = this.loadMoreMessages.bind(this);
    this.renderMessagesTree = this.renderMessagesTree.bind(this);
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

  componentDidUpdate() {
    // Scroll down on component
    const node = this.scrollContainer.current;
    if (node && node.scrollTop !== node.scrollHeight && !this.state.scrolled) {
      this.scrollHandler(node);
    }
  }

  componentWillUnmount() {
    if (this.props.cancelToken !== null) {
      this.props.cancelToken.call();
    }
  }

  loadMoreMessages() {
    if (
      this.props.selectedChat &&
      Object.keys(this.props.selectedChat).length !== 0 &&
      Object.getPrototypeOf(this.props.selectedChat) !== Object.prototype
    ) {
      const {
        selectedChat: { id: chatId },
        textMessages,
      } = this.props;
      this.setState(
        {
          loadingMessages: true,
          offset: textMessages.size,
        },
        () => {
          const { offset } = this.state;
          this.props.loadChatMessages(chatId, offset, DEFAULT_LIMIT).then(() => {
            this.setState({ loadingMessages: false });
          });
        },
      );
    }
  }

  scrollHandler(node) {
    node.scrollTop = node.scrollHeight;
  }

  sendMessageHandler({ message }) {
    if (this.state.sendingMessage || !message) return;
    this.setState({ sendingMessage: true });
    const accountId = this.props.activeAccount.id;
    const {
      selectedPatient: { cellPhoneNumber, id },
      selectedChat: { id: chatId },
      userId,
    } = this.props;

    const patient = {
      accountId,
      cellPhoneNumber,
      id,
    };

    const request = {
      addedAt: Date.now(),
      message,
      patient,
      userId,
    };

    if (chatId) {
      request.chatId = chatId;
    }

    if (!chatId) {
      this.props.reset('chatMessageForm_newChat');
      this.props
        .createNewChat(request)
        .then((chat) => {
          const [newId] = Object.keys(chat.chats);
          request.chatId = newId;
          this.props.sendChatMessage(request);
          this.props.setTab(chatTabs.ALL_TAB);
        })
        .finally(() => {
          this.setState({ sendingMessage: false });
        });
      return;
    }

    this.props.reset(`chatMessageForm_${chatId}`);
    this.props
      .sendChatMessage(request)
      .then(() => {
        this.props.selectChat(chatId);
      })
      .finally(() => {
        this.setState({ sendingMessage: false }, () => {
          this.scrollHandler(this.scrollContainer.current);
        });
      });
  }

  groupChatMessages() {
    const { textMessages, timezone } = this.props;
    const group = [];
    let currentGroup = { messages: [] };

    textMessages.forEach((message) => {
      const { createdAt } = message;
      if (!currentGroup.time) {
        currentGroup.time = createdAt;
      }

      if (currentGroup.messages.length === 0) {
        return currentGroup.messages.push(message);
      }

      if (!isWithinTimePeriod(currentGroup.time, createdAt, timezone)) {
        group.push(currentGroup);
        currentGroup = {
          time: createdAt,
          messages: [],
        };
      }

      return currentGroup.messages.push(message);
    });

    group.push(currentGroup);
    return group;
  }

  renderMessageGroup(messages) {
    const { pendingMessages, selectedPatient } = this.props;
    const activeAccount = this.props.activeAccount.toJS();

    if (!Array.isArray(messages) || messages.length < 1) {
      return null;
    }

    const isPending = (message) =>
      Boolean(message.get('id')) &&
      !pendingMessages.includes((pending) => pending.id === message.get('id'));

    return messages.filter(isPending).map((message) => {
      const isFromPatient = message.get('from') !== activeAccount.twilioPhoneNumber;
      let avatarUser = selectedPatient;

      if (!isFromPatient) {
        avatarUser = message.user && message.user.id ? message.user : botAvatar;
      }

      const hasFailed = message.get('smsStatus') === 'failed';
      const avatar = hasFailed ? (
        <Icon className={styles.avatar__failed} icon="exclamation-circle" size={2} type="solid" />
      ) : (
        <Avatar
          size="xs"
          className={styles.bubbleAvatar}
          user={avatarUser}
          isPatient={isFromPatient}
        />
      );

      return (
        <div key={message.id} data-test-id="item_chatMessage" className={styles.messageWrapper}>
          <div
            key={message.get('id')}
            className={isFromPatient ? styles.patientMessage : styles.clinicMessage}
          >
            {isFromPatient && avatar}
            <MessageBubble textMessage={message} isFromPatient={isFromPatient} />
            {!isFromPatient && avatar}
            {isFromPatient && (
              <div
                className={styles.dotsWrapper}
                data-test-id="chat_unreadDots"
                ref={this.optionsWrapper}
              >
                <Tooltip
                  getTooltipContainer={() => this.optionsWrapper.current}
                  overlay={
                    <MarkUnreadButton
                      chatId={message.get('chatId')}
                      createdAt={message.get('createdAt')}
                    />
                  }
                  placement="right"
                  trigger={['hover']}
                >
                  <div className={styles.dotsIconWrapper}>
                    <Icon
                      icon="ellipsis-h"
                      size={2}
                      className={styles.dotsIcon}
                      id={`dots_${message.id}`}
                    />
                  </div>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      );
    });
  }

  renderMessagesTree() {
    const { timezone } = this.props;
    return this.groupChatMessages().map(({ messages, time }, index) => {
      const heading = messages.length !== 0 ? getMessageTime(time, timezone) : 'No messages';

      return (
        <div className={styles.groupWrapper} key={time || index}>
          <div className={styles.time}>{heading}</div>
          <div>{this.renderMessageGroup(messages)}</div>
        </div>
      );
    });
  }

  render() {
    const { loadingMessages, loadedMessages } = this.state;
    const {
      conversationIsLoading,
      selectedChat,
      newChat,
      totalChatMessages,
      isNewconversation,
    } = this.props;

    const hasMoreMessages = totalChatMessages > loadedMessages;
    const chat = selectedChat || { ...newChat, id: 'newChat' };

    return (
      <SContainer className={styles.messageContainer}>
        <SBody
          id="careCruChatScrollIntoView"
          className={styles.allMessages}
          refCallback={this.scrollContainer}
          onScroll={(e) => {
            const { clientHeight, scrollHeight, scrollTop } = e.target;
            const scrollSum = clientHeight + scrollTop + 10;
            if (scrollSum >= scrollHeight) {
              this.setState({ scrolled: false });
            } else {
              this.setState({ scrolled: true });
            }
          }}
        >
          <InfiniteScroll
            isReverse
            useWindow={false}
            loadMore={this.loadMoreMessages}
            hasMore={hasMoreMessages && !loadingMessages}
            threshold={100}
          >
            {selectedChat &&
              !conversationIsLoading &&
              !isNewconversation &&
              this.renderMessagesTree()}
            {selectedChat && !conversationIsLoading && !isNewconversation && <PendingMessages />}
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
  const pendingMessages = chat.get('pendingMessages');
  const prospect = chat.get('prospect');
  const textMessages = chat.get('chatMessages');
  const totalChatMessages = chat.get('totalChatMessages');
  const getPatient = ({ patientId, patientPhoneNumber }) =>
    patientId ? patients.get(patientId) : UnknownPatient(patientPhoneNumber, prospect);
  const selectedPatient = (selectedChat && getPatient(selectedChat)) || {};
  return {
    conversationIsLoading: chat.get('conversationIsLoading'),
    textMessages,
    selectedChat,
    totalChatMessages,
    selectedPatient,
    newChat: chat.get('newChat'),
    userId: auth.getIn(['user', 'id']),
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
    pendingMessages,
    timezone: auth.get('timezone'),
    cancelToken: chat.get('cancelToken'),
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
      loadChatMessages,
      getChatCategoryCounts,
    },
    dispatch,
  );
}

MessageContainer.propTypes = {
  conversationIsLoading: PropTypes.bool.isRequired,
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
  selectedPatient: PropTypes.shape({
    id: PropTypes.string,
    cellPhoneNumber: PropTypes.string,
  }),
  userId: PropTypes.string.isRequired,
  totalChatMessages: PropTypes.number.isRequired,
  selectChatOrCreate: PropTypes.func.isRequired,
  selectChat: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  sendChatMessage: PropTypes.func.isRequired,
  createNewChat: PropTypes.func.isRequired,
  setTab: PropTypes.func.isRequired,
  loadChatMessages: PropTypes.func.isRequired,
  pendingMessages: PropTypes.oneOfType([
    PropTypes.arrayOf(ChatTextMessage),
    PropTypes.instanceOf(OrderedMap),
  ]),
  cancelToken: PropTypes.func,
  timezone: PropTypes.string.isRequired,
  isNewconversation: PropTypes.bool.isRequired,
};

MessageContainer.defaultProps = {
  newChat: null,
  selectedChat: null,
  selectedPatient: null,
  pendingMessages: [],
  cancelToken: null,
};

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(MessageContainer);
