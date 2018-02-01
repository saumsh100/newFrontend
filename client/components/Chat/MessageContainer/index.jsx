
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import jwt from 'jwt-decode';
import moment from 'moment';
import {
  Avatar,
  Form,
  Field,
  Button,
  Icon,
  SContainer,
  SBody,
  SFooter,
} from '../../library';
import MessageBubble from './MessageBubble';
import MessageTextArea from './MessageTextArea';
import * as Actions from '../../../actions/entities';
import { createEntityRequest, updateEntityRequest } from '../../../thunks/fetchEntities';
import { setSelectedChatId, setNewChat } from '../../../reducers/chat';
import styles from './styles.scss';

class MessageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonClass: styles.sendButtonOff,
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.button = this.button.bind(this);
  }

  componentDidMount() {
    // TODO: post to /read endpoint
    // TODO: IF there are messages that are unread
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
  }

  componentDidUpdate() {
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
  }

  button(e) {
    if (e.target.value && e.target.value.length !== 0) {
      this.setState({
        buttonClass: styles.sendButton,
      });
    } else {
      this.setState({
        buttonClass: styles.sendButtonOff,
      });
    }
  }

  sendMessage(mobilePhoneNumber, values) {
    const accountId = this.props.activeAccount.id;
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);

    const entityData = {
      message: values.message,
      patient: {
        id: this.props.selectedPatient.id,
        mobilePhoneNumber,
        accountId,
      },

      userId: decodedToken.userId,
    };

    entityData.chatId = (this.props.selectedChat ? this.props.selectedChat.id : null);

    if (!entityData.chatId) {
      // Create chat, then send textMessage
      this.props.createEntityRequest({ key: 'chats', entityData, url: '/api/chats' })
        .then((chat) => {
          entityData.chatId = Object.keys(chat.chats)[0];
          this.props.createEntityRequest({ key: 'chats', entityData, url: '/api/chats/textMessages' })
            .then(() => {
              // Remove new chat as this is now a regular chat!
              this.props.setSelectedChatId(entityData.chatId);
              this.props.setNewChat(null);

              this.props.reset('chatMessageForm_newChat');

              // Scroll down on component
              const node = document.getElementById('careCruChatScrollIntoView');
              if (node) {
                node.scrollTop = node.scrollHeight;
              }
            });
        });
    } else {
      this.props.createEntityRequest({ key: 'chats', entityData, url: '/api/chats/textMessages' })
        .then(() => {
          this.props.reset(`chatMessageForm_${entityData.chatId}`);

          // Scroll down on component
          const node = document.getElementById('careCruChatScrollIntoView');
          if (node) {
            node.scrollTop = node.scrollHeight;
          }
        });
    }
  }

  render() {
    const {
      selectedChat,
      selectedPatient,
      newChat,
    } = this.props;

    let display;

    let userPhone = null;

    if (selectedChat) {
      // TODO: change this to componentDidMount
      display = selectedChat.textMessages.map((text, i) => {
        const message = this.props.textMessages.get(selectedChat.textMessages[i]);
        if (!message.get('read')) {
          // TODO: Absolutely get rid of this...
          this.props.updateEntityRequest({
            key: 'textMessages',
            values: {},
            url: `/api/chats/${selectedChat.id}/textMessages/read`,
          });
        }

        let avatar;
        let bubble;
        let time = (
          <div className={styles.time}>
            {moment(message.createdAt).calendar(null, {
              sameDay: '[Today], h:mm a',
              nextDay: '[Tomorrow]',
              nextWeek: 'dddd',
              lastDay: '[Yesterday], h:mm a',
              lastWeek: '[Last] dddd h:mm a',
              sameElse: 'YYYY DD MM, h:mm a',
            })}
          </div>
        );

        if (message.to !== this.props.activeAccount.toJS().twilioPhoneNumber) {
          userPhone = message.to;
        } else {
          userPhone = message.from;
        }

        let nextMessage = this.props.textMessages.get(this.props.selectedChat.textMessages[i + 1]);
        nextMessage = (nextMessage ? nextMessage.from : null);

        const isFromPatient = message.from !== this.props.activeAccount.toJS().twilioPhoneNumber;

        if (isFromPatient) {
          bubble = <MessageBubble textMessage={message} isFromPatient />;
          avatar = (
            <Avatar
              size="xs"
              className={styles.patientAvatar}
              user={selectedPatient}
            />
          );

          if (i !== 0) {
            const lastMessage = this.props.textMessages.get(this.props.selectedChat.textMessages[i - 1]);
            if (moment(message.createdAt).diff(moment(lastMessage.createdAt), 'days') < 1) {
              time = null;
            }
          }
        } else {
          // From clinic
          bubble = <MessageBubble textMessage={message} />;

          // TODO: not putting Avatars for now
          //if (nextMessage !== message.from) {
            // first = <Avatar className={styles.margin} user={user} />;
          //}

          if (i !== 0) {
            const lastMessage = this.props.textMessages.get(this.props.selectedChat.textMessages[i - 1]);
            if (message.from === lastMessage.from && moment(message.createdAt).diff(moment(lastMessage.createdAt), 'days') < 1) {
              time = null;
            }
          }
        }

        return (
          <div
            key={text}
            className={styles.messageWrapper}
            data-test-id="chatMessage"
          >
            {time}
            <div
              className={isFromPatient ? styles.patientMessage : styles.clinicMessage}
            >
              {avatar}
              {bubble}
            </div>
          </div>
        );
      });
    }

    const chat = selectedChat || Object.assign({}, newChat, { id: 'newChat' });

    return (
      <SContainer className={styles.container}>
        <SBody
          id="careCruChatScrollIntoView"
          className={styles.allMessages}
          refCallback={node => this.scrollContainer = node}
        >
          {display}
          <div className={styles.raise} />
        </SBody>
        <SFooter className={styles.sendMessage}>
          <MessageTextArea
            chat={chat}
            onSendMessage={(values) => this.sendMessage(selectedPatient.mobilePhoneNumber, values)}
          />
        </SFooter>
      </SContainer>
    );
  }
}

MessageContainer.propTypes = {
  currentPatient: PropTypes.object,
  textMessages: PropTypes.object,
  chats: PropTypes.object,
  patients: PropTypes.object,
  activeAccount: PropTypes.object,
  selectedChat: PropTypes.object,
  newChat: PropTypes.object,
  createEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  receiveMessage: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, auth, chat }) {
  const selectedChatId = chat.get('selectedChatId');
  const chats = entities.getIn(['chats', 'models']);
  const patients = entities.getIn(['patients', 'models']);

  // TODO: turn this into selectedPatient not selectedChat
  const selectedChat = chats.get(selectedChatId) || chat.get('newChat');
  const selectedPatientId = selectedChat && selectedChat.patientId;

  return {
    newChat: chat.get('newChat'),
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
    selectedPatient: patients.get(selectedPatientId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    receiveMessage: Actions.receiveEntities,
    createEntityRequest,
    updateEntityRequest,
    setSelectedChatId,
    setNewChat,
    reset,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(MessageContainer);
