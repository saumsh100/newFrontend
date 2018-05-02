
import React, { PropTypes, Component } from 'react';
import immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import moment from 'moment';
import { Avatar, SContainer, SBody, SFooter, Icon, Tooltip } from '../../library';
import MessageBubble from './MessageBubble';
import MessageTextArea from './MessageTextArea';
import { setNewChat } from '../../../reducers/chat';
import { sendChatMessage, createNewChat, selectChat, markAsUnread } from '../../../thunks/chat';
import styles from './styles.scss';

class MessageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sendingMessage: false,
    };

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
    let currentGroup = {
      messages: [],
    };

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

    return messages.map((message, index) => {
      const isFromPatient =
        message.get('from') !== this.props.activeAccount.toJS().twilioPhoneNumber;
      const dotsIcon = (
        <Icon icon="ellipsis-h" size={2} className={styles.dotsIcon} id={`dots_${message.id}`} />
      );

      const markUnreadText = (
        <div
          className={styles.markUnreadButton}
          onClick={() => this.props.markAsUnread(message.get('chatId'), message.get('createdAt'))}
        >
          Mark unread
        </div>
      );

      const avatarUser = isFromPatient ? selectedPatient : message.user;

      const avatar = <Avatar size="xs" className={styles.bubbleAvatar} user={avatarUser} />;

      let optionsWrapper = null;

      const messageOptions = isFromPatient ? (
        <div
          ref={(reference) => {
            optionsWrapper = reference;
          }}
        >
          <Tooltip
            trigger={['click', 'hover']}
            overlay={markUnreadText}
            placement={'right'}
            getTooltipContainer={() => optionsWrapper}
          >
            {dotsIcon}
          </Tooltip>
        </div>
      ) : null;

      return (
        <div key={index} data-test-id="item_chatMessage" className={styles.messageWrapper}>
          <div
            key={message.get('id')}
            className={isFromPatient ? styles.patientMessage : styles.clinicMessage}
          >
            {isFromPatient && avatar}
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
      const time = <div className={styles.time}>{this.getMessageTime(group.time)}</div>;

      return (
        <div className={styles.groupWrapper} key={index}>
          {time}
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
          refCallback={node => (this.scrollContainer = node)}
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

MessageContainer.propTypes = {
  textMessages: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(immutable.OrderedMap),
  ]),
  activeAccount: PropTypes.shape({
    id: PropTypes.string,
    twilioPhoneNumber: PropTypes.string,
    toJS: PropTypes.func,
  }),
  selectedChat: PropTypes.shape({
    id: PropTypes.string,
  }),
  newChat: PropTypes.shape({
    id: PropTypes.string,
  }),
  selectedPatient: PropTypes.shape({
    id: PropTypes.string,
  }),
  userId: PropTypes.string,
  selectChat: PropTypes.func,
  setNewChat: PropTypes.func,
  reset: PropTypes.func,
  sendChatMessage: PropTypes.func,
  createNewChat: PropTypes.func,
  markAsUnread: PropTypes.func,
};

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
    },
    dispatch
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(MessageContainer);
