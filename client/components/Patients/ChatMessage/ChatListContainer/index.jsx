
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ListItem } from '../../../library';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import styles from '../styles.scss';

class ChatListContainer extends Component {
  constructor(props) {
    super(props);
    this.setPatient = this.setPatient.bind(this);
  }

  setPatient(id, chatId) {
    this.props.onClick(id);
    this.props.updateEntityRequest({ key: 'textMessages', values: {}, url: `/api/chats/${chatId}/textMessages/read` });
  }

  render() {
    const everyone = (this.props.chats.size ? (this.props.chats.toArray().map((chats) => {
      const chat = JSON.parse(JSON.stringify(chats));
      const user = this.props.patients.get(chat.patientId);
      chat.user = user;
      chat.newMessages = 0;
      let messageRecent = '';
      const length = (chat.textMessages ? chat.textMessages.length : 0);

      for (let i = 0; i < length; i++) {
        if (i === chat.textMessages.length - 1) {
          messageRecent = this.props.textMessages.get(chat.textMessages[i]);
        }
        if (!this.props.textMessages.get(chat.textMessages[i]).read) {
          chat.newMessages++;
        }
      }

      let userActiveClassName;

      let newMessage = null;

      if (chat.newMessages !== 0) {
        newMessage = (
          <div className={styles.messageNote}>
            {chat.newMessages}
          </div>
        );
      }

      if (this.props.currentPatient) {
        userActiveClassName = classNames(
          styles.users,
          chat.user.id === this.props.currentPatient.id ?
            styles.users__active :
            styles.users__noactive
        );
      } else {
        userActiveClassName = classNames(
          styles.users,
          styles.users__noactive
        );
      }
      const age = moment().diff(user.birthDate, 'years');

      const time = <div className={styles.timeChat}>{moment(messageRecent.createdAt).calendar(null, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd ',
        sameElse: 'YYYY DD MM',
      })}</div>;

      const avatar = (chat.user.avatarUrl ? chat.user.avatarUrl : '/images/avatar.png');


        return (
          <ListItem
            className={userActiveClassName}
            onClick={this.setPatient.bind(null, chat.user.id, chat.id)}
            key={chat.user.id}
          >
            <img
              className={styles.users__photo}
              src={avatar}
              alt="photo"
            />
            <div className={styles.users__wrapper}>
              <div className={styles.users__header}>
                <div className={styles.users__name}>
                  {chat.user.firstName} {chat.user.lastName}, {age}
                </div>
              </div>
              <div className={styles.users__body}>
                <div className={styles.users__text}>
                  {messageRecent.body}
                </div>
              </div>
            </div>
            {newMessage}
            {time}
          </ListItem>
        );
      })) : null);

    return <div>{everyone}</div>;
  }
}

ChatListContainer.propTypes = {
  textMessages: PropTypes.object,
  chats: PropTypes.object,
  currentPatient: PropTypes.object,
  patients: PropTypes.object,
  updateEntityRequest: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ChatListContainer);
