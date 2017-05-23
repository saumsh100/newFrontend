import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from '../styles.scss';
import moment from 'moment';
import { ListItem } from '../../../library';

class ChatListContainer extends Component {
  constructor(props) {
    super(props);
    this.setPatient = this.setPatient.bind(this);
  }

  setPatient(id) {
    this.props.onClick(id);
  }

  render() {

    const everyone = (this.props.chats.size ? (this.props.chats.toArray().map((chats) => {
      const chat = JSON.parse(JSON.stringify(chats));
      const user = this.props.patients.get(chat.patientId);
      chat.user = user;
      chat.newMessages = 0;
      let messageRecent = '';

      for (let i = 0; i < chat.textMessages.length; i++) {
        if (i === chat.textMessages.length - 1) {
          messageRecent = this.props.textMessages.get(chat.textMessages[0]).body;
        }
        if (!this.props.textMessages.get(chat.textMessages[i]).read) {
          chat.newMessages++;
        }
      }

      let userActiveClassName;

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


      return (<ListItem className={userActiveClassName} onClick={this.setPatient.bind(null, chat.user.id)} key={chat.user.id}>
        <img className={styles.users__photo}  src={chat.user.avatar} alt="photo" />
        <div className={styles.users__wrapper}>
          <div className={styles.users__header}>
            <div className={styles.users__name}>
              {chat.user.firstName} {chat.user.lastName}, {age}
            </div>

          </div>
          <div className={styles.users__body}>
            <div className={styles.users__text}>
              {messageRecent}
            </div>
          </div>
        </div>
      </ListItem>);
    })) : null);

    return <div>{everyone}</div>;
  }
}

ChatListContainer.propTypes = {
  textMessages: PropTypes.object.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
};

export default ChatListContainer;
