
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OrderedMap } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import classNames from 'classnames';
import moment from 'moment';
import { Avatar, SContainer, SBody, SFooter, Icon, Tooltip, Button } from '../../library';
import MessageBubble from './MessageBubble';
import MessageTextArea from './MessageTextArea';
import { setNewChat } from '../../../reducers/chat';
import {
  sendChatMessage,
  createNewChat,
  selectChat,
  markAsUnread,
  resendMessage,
} from '../../../thunks/chat';
import ChatTextMessage from '../../../entities/models/TextMessage';
import chatTabs from '../consts';
import styles from './styles.scss';

class MessageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { sendingMessage: false };

    this.sendMessageHandler = this.sendMessageHandler.bind(this);
  }

  componentDidMount() {
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
  }

  componentWillReceiveProps() {
    // Scroll down on component
    const node = document.getElementById('careCruChatScrollIntoView');
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }

  componentDidUpdate() {
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
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

  sendMessageHandler(values) {
    if (this.state.sendingMessage) return;

    this.setState({ sendingMessage: true });

    const accountId = this.props.activeAccount.id;
    const { selectedPatient, selectedChat, userId } = this.props;
    const { mobilePhoneNumber } = selectedPatient;

    if (!values.message) return;

    const patient = {
      id: this.props.selectedPatient.id,
      mobilePhoneNumber,
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
          this.props.setNewChat(null);
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
        this.props.setNewChat(null);
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
      const patientId = selectedPatient.get('id');

      const dotsIcon = (
        <Icon icon="ellipsis-h" size={2} className={styles.dotsIcon} id={`dots_${message.id}`} />
      );

      const markUnreadText = (
        <Button
          className={styles.markUnreadButton}
          data-test-id="chat_markUnreadBtn"
          onClick={() => this.props.markAsUnread(message.get('chatId'), message.get('createdAt'))}
        >
          Click here to mark as unread
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

      let optionsWrapper = null;
      let failedMessageWrapper = null;

      const failedMessage = message.get('smsStatus') === 'failed' && (
        <div
          className={styles.failedMessage}
          ref={(reference) => {
            failedMessageWrapper = reference;
          }}
        >
          <Tooltip
            trigger={['hover']}
            overlay={resendMessageButton}
            placement="left"
            getTooltipContainer={() => failedMessageWrapper}
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
          ref={(reference) => {
            optionsWrapper = reference;
          }}
        >
          <Tooltip
            trigger={['hover']}
            overlay={markUnreadText}
            placement="right"
            getTooltipContainer={() => optionsWrapper}
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
    const { selectedChat, newChat } = this.props;

    const chat = selectedChat || Object.assign({}, newChat, { id: 'newChat' });

    return (
      <SContainer className={styles.container}>
        <SBody
          id="careCruChatScrollIntoView"
          className={styles.allMessages}
          refCallback={(node) => {
            this.scrollContainer = node;
          }}
        >
          {selectedChat && this.renderMessagesTree()}
          <div className={styles.raise} />
        </SBody>
        <SFooter className={styles.sendMessage}>
          <MessageTextArea
            chat={chat}
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
  const selectedPatientId = selectedChat && selectedChat.patientId;
  const textMessages = chat.get('chatMessages');

  return {
    textMessages,
    selectedChat,
    newChat: chat.get('newChat'),
    userId: auth.getIn(['user', 'id']),
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
    selectedPatient: patients.get(selectedPatientId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectChat,
      setNewChat,
      reset,
      sendChatMessage,
      createNewChat,
      markAsUnread,
      resendMessage,
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
  selectChat: PropTypes.func.isRequired,
  setNewChat: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  sendChatMessage: PropTypes.func.isRequired,
  createNewChat: PropTypes.func.isRequired,
  markAsUnread: PropTypes.func.isRequired,
  resendMessage: PropTypes.func.isRequired,
  setTab: PropTypes.func.isRequired,
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
