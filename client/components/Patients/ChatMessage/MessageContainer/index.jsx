
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jwt from 'jwt-decode';
import moment from 'moment';
import { Avatar, Form, Field, Button } from '../../../library';
import * as Actions from '../../../../actions/entities';
import { createEntityRequest, updateEntityRequest } from '../../../../thunks/fetchEntities';
import styles from '../styles.scss';

class MessageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonClass: styles.sendButtonOff,
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.button = this.button.bind(this);
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

  sendMessage(mobilePhoneNumber, message) {
    const accountId = this.props.activeAccount.id;
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);

    const entityData = {
      message: message.message,
      patient: this.props.currentPatient || { mobilePhoneNumber, accountId },
      userId: decodedToken.userId,
    };

    entityData.chatId = (this.props.selectedChat ? this.props.selectedChat.id : null);

    if (!entityData.chatId) {
      this.props.createEntityRequest({ key: 'chats', entityData, url: '/api/chats/' })
        .then((chat) => {
          entityData.chatId = Object.keys(chat.chats)[0];
          const patientId = chat.chats.patientId;
          this.props.setSelectedPatient(patientId);
          this.props.createEntityRequest({ key: 'chats', entityData, url: '/api/chats/textMessages' })
            .then(() => {
              const node = document.getElementById('careCruChatScrollIntoView');

              if (node) {
                node.scrollTop = node.scrollHeight - node.getBoundingClientRect().height;
              }
            });
        });
    } else {
      this.props.createEntityRequest({ key: 'chats', entityData, url: '/api/chats/textMessages' })
        .then(() => {
          const node = document.getElementById('careCruChatScrollIntoView');

          if (node) {
            node.scrollTop = node.scrollHeight - node.getBoundingClientRect().height;
          }
        });
    }
    message.message = '';
  }

  render() {
    let display;

    const userAnon = {
      avatarUrl: '/images/avatar.png',
    };

    let userPhone = null;

    if (this.props.selectedChat) {
      display = this.props.selectedChat.textMessages.map((text, i) => {
        const message = this.props.textMessages.get(this.props.selectedChat.textMessages[i]);
        if (!message.get('read')) {
          this.props.updateEntityRequest({ key: 'textMessages', values: {}, url: `/api/chats/${this.props.selectedChat.id}/textMessages/read` });
        }

        const user = (message.user ? message.user : { avatarUrl: '/images/Donna - Pop Up.png' })

        let first;
        let second;
        let third;
        let time = <div className={styles.time}>{moment(message.createdAt).calendar(null, {
          sameDay: '[Today], h:mm a',
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd',
          lastDay: '[Yesterday], h:mm a',
          lastWeek: '[Last] dddd h:mm a',
          sameElse: 'YYYY DD MM, h:mm a',
        })}</div>;

        console.log(this.props.activeAccount.toJS().twilioPhoneNumber)

        if (message.to !== this.props.activeAccount.toJS().twilioPhoneNumber) {
          userPhone = message.to;
        } else {
          userPhone = message.from;
        }

        let nextMessage = this.props.textMessages.get(this.props.selectedChat.textMessages[i + 1]);
        nextMessage = (nextMessage ? nextMessage.from : null);

        if (message.from !== this.props.activeAccount.toJS().twilioPhoneNumber) {
          first = <div className={styles.marginText}>{moment(message.createdAt).format('h:mm a')}</div>;
          second = <div className={styles.textFrom}>{message.body}</div>;
          third = <div className={styles.margin2} > </div>;

          if (nextMessage !== message.from) {
            third = <Avatar className={styles.margin} user={this.props.currentPatient || userAnon} />;
          }

          if (i !== 0) {
            const lastMessage = this.props.textMessages.get(this.props.selectedChat.textMessages[i - 1]);
            if (moment(message.createdAt).diff(moment(lastMessage.createdAt), 'days') < 1) {
              time = null;
            }
          }
        } else {
          third = <div className={styles.marginText}>{moment(message.createdAt).format('h:mm a')}</div>;
          second = <div className={styles.text}>{message.body}</div>;
          first = <div className={styles.margin2} > </div>;

          if (nextMessage !== message.from) {
            first = <Avatar className={styles.margin} user={user} />;
          }

          if (i !== 0) {
            const lastMessage = this.props.textMessages.get(this.props.selectedChat.textMessages[i - 1]);
            if (message.from === lastMessage.from && moment(message.createdAt).diff(moment(lastMessage.createdAt), 'days') < 1) {
              time = null;
            }
          }
        }

        return (<div key={text} className={styles.textTime} data-test-id="chatMessage">
          {time}
          {third}{second}{first}
        </div>);
      });
    }

    const name = (this.props.currentPatient ? `${this.props.currentPatient.firstName} ${this.props.currentPatient.lastName}` : null );

    return (
      <div className={styles.container}>
        <div className={styles.allMessages} id="careCruChatScrollIntoView">
          <div className={styles.patientName}> {name} </div>
          {display}
          <div className={styles.raise}>
          </div>
        </div>
        <div className={styles.sendMessage}>
          <Form
            form="chatMessageForm"
            ignoreSaveButton
            onSubmit={this.sendMessage.bind(null, userPhone)}
            data-test-id="chatMessageForm"
          >
            <div className={styles.send}>
              <div className={styles.sendInput}>
                <Field
                  onChange={this.button}
                  type="text"
                  name="message"
                  label="Type a message"
                  data-test-id="message"
                />
              </div>
              <button className={styles.button} type="submit">
                <svg className={this.state.buttonClass} fill="#000000" height="40" viewBox="0 0 24 24" width="40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  <path d="M0 0h24v24H0z" fill="none" />
                </svg>
              </button>
            </div>
          </Form>
        </div>
      </div>
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
  createEntityRequest: PropTypes.func.isRequired,
  setSelectedPatient: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  receiveMessage: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  return {
    activeAccount,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    receiveMessage: Actions.receiveEntities,
    createEntityRequest,
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(MessageContainer);
