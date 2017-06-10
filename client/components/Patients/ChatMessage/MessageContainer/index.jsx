
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jwt from 'jwt-decode';
import moment from 'moment';
import { Avatar, Form, Field } from '../../../library';
import * as Actions from '../../../../actions/entities';
import { createEntityRequest, updateEntityRequest } from '../../../../thunks/fetchEntities';
import styles from '../styles.scss';

class MessageContainer extends Component {
  constructor(props) {
    super(props);

    this.sendMessage = this.sendMessage.bind(this);
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

    console.log(this.props.currentPatient.toJS())

    entityData.chatId = (this.props.selectedChat ? this.props.selectedChat.id : null);

    console.log(entityData.chatId)

    if (!entityData.chatId) {
      this.props.createEntityRequest({ key: 'chats', entityData, url: '/api/chats/' })
        .then((chat) => {
          entityData.chatId = Object.keys(chat.chats)[0];
          const patientId = Object.keys(chat.patients)[0];
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

        return (<div key={text} className={styles.textTime}>
          {time}
          {first}{second}{third}
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
          >
            <Field
              type="text"
              name="message"
              label="Type a message"
            />
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

function mapStateToProps({ entities }) {
  return {
    activeAccount: entities.getIn(['accounts', 'models']).first(),
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
