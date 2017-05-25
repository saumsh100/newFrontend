import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import styles from '../styles.scss';
import { Avatar, Form, Field } from '../../../library';
import * as Actions from '../../../../actions/entities';


class MessageContainer extends Component {
  constructor(props) {
    super(props);
    this.sendMessage = this.sendMessage.bind(this);

    window.socket.on('newMessage', (data) => {
      const result = JSON.parse(data);
      this.props.receiveMessage({ key: 'chats', entities: result.entities });

      const node = document.getElementById('scrollIntoView');

      if (node) {
        node.scrollTop = node.scrollHeight - node.getBoundingClientRect().height;
      }

    });

  }

  sendMessage(message) {
    window.socket.emit('sendMessage', {
      message: message.message,
      patient: this.props.currentPatient,
      chatId: this.props.selectedChat.id,
    });
  }

  render() {
    let display;

    if (this.props.selectedChat) {
      display = this.props.selectedChat.textMessages.map((text, i) => {
        const message = this.props.textMessages.get(this.props.selectedChat.textMessages[i]);
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

        if (message.from === this.props.currentPatient.phoneNumber) {
          first = <div className={styles.marginText}>{moment(message.createdAt).format('h:mm a')}</div>;
          second = <div className={styles.textFrom}>{message.body}</div>;
          third = <Avatar className={styles.margin} url={this.props.currentPatient.avatar}/>;
          if (i !== 0) {
            const lastMessage = this.props.textMessages.get(this.props.selectedChat.textMessages[i - 1]);
            if (message.from === lastMessage.from && moment(message.createdAt).diff(moment(lastMessage.createdAt), 'days') < 1) {
              time = null;
            }
          }
        } else {
          third = <div className={styles.marginText}>{moment(message.createdAt).format('h:mm a')}</div>;
          second = <div className={styles.text}>{message.body}</div>;
          first = <Avatar className={styles.margin} url='https://placeimg.com/80/80/people'/>;
          if (i !== 0) {
            const lastMessage = this.props.textMessages.get(this.props.selectedChat.textMessages[i - 1]);
            if (message.from === lastMessage.from && moment(message.createdAt).diff(moment(lastMessage.createdAt), 'days') < 1) {
              time = null;
            }
          }
        }

        return (<div className={styles.textTime}>
          {time}
          {first}{second}{third}
        </div>);
      });
    }

    const name = (this.props.currentPatient ? `${this.props.currentPatient.firstName} ${this.props.currentPatient.lastName}` : null );

    return (
      <div className={styles.allMessages} id="scrollIntoView">
        <div className={styles.patientName}> {name} </div>
        {display}
        <div className={styles.raise}>
        </div>
        <div className={styles.sendMessage}>
          <Form
            form="chatMessageForm"
            ignoreSaveButton
            onSubmit={this.sendMessage}
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
  textMessages: PropTypes.object.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    receiveMessage: Actions.receiveEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(MessageContainer);
