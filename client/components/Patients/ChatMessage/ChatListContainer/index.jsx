import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from '../styles.scss';
import { ListItem, Avatar } from '../../../library';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';



class ChatListContainer extends Component {
  constructor(props) {
    super(props);
    this.setPatient = this.setPatient.bind(this);
  }

  setPatient(id, chatId) {
    this.props.onClick(id, chatId);
    this.props.updateEntityRequest({ key: 'textMessages', values: {}, url: `/api/chats/${chatId}/textMessages/read` });
  }

  render() {

    const everyone = (this.props.chats.size ? (this.props.chats.toArray().map((chats) => {
      const chat = JSON.parse(JSON.stringify(chats));

      if (!chat.textMessages[0]) {
        return null;
      }

      const user = this.props.patients.get(chat.patientId);
      chat.user = user || {};
      chat.newMessages = 0;
      let messageRecent = '';
      const length = (chat.textMessages ? chat.textMessages.length : 0);

      let userPhone = null;
      let firstMessage = {};
      if (chat.textMessages[0]) {
        firstMessage = this.props.textMessages.get(chat.textMessages[0]).toJS();
      }

      if (firstMessage.to !== this.props.activeAccount.toJS().twilioPhoneNumber) {
        userPhone = firstMessage.to;
      } else {
        userPhone = firstMessage.from;
      }

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
        newMessage = (<div className={styles.messageNote}>
          {chat.newMessages}
        </div>
        );
      }

      if (this.props.selectedChat) {
        userActiveClassName = classNames(
          styles.users,
          chat.id === this.props.selectedChat.id ?
            styles.users__active :
            styles.users__noactive
        );
      } else {
        userActiveClassName = classNames(
          styles.users,
          styles.users__noactive
        );
      }
      const age = (user ? moment().diff(user.birthDate, 'years') : null);

      const userDisplay = (user ? (<div className={styles.users__name}>
        <span>{`${chat.user.firstName} ${chat.user.lastName}`}</span><span>, {`${age || 'N/A'}`}</span>
      </div>) : <div className={styles.users__name}> {userPhone} </div>);

      const time = <div className={styles.timeChat}>{moment(messageRecent.createdAt).calendar(null, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd ',
        sameElse: 'YYYY DD MM',
      })}</div>;

      const avatar = (chat.user ? chat.user : {});

      const message = (messageRecent.body.length > 111 ? `${messageRecent.body.slice(0, 111)} ...` : messageRecent.body);

      return (<ListItem className={userActiveClassName} onClick={this.setPatient.bind(null, chat.user.id, chat.id)} key={chat.user.id}>
        <Avatar className={styles.users__photo} user={avatar} size="lg" />
        <div className={styles.users__wrapper}>
          <div className={styles.users__header}>
            {userDisplay}
          </div>
          <div className={styles.users__body}>
            <div className={styles.users__text}>
              {message}
            </div>
          </div>
        </div>
        {newMessage}
        {time}
      </ListItem>);
    })) : null);

    return <div>{everyone}</div>;
  }
}

ChatListContainer.propTypes = {
  textMessages: PropTypes.object,
  chats: PropTypes.object,
  selectedChat: PropTypes.object,
  activeAccount: PropTypes.object,
  currentPatient: PropTypes.object,
  patients: PropTypes.object,
  updateEntityRequest: PropTypes.func.isRequired,
};

function mapStateToProps({ entities }) {
  return {
    activeAccount: entities.getIn(['accounts', 'models']).first(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ChatListContainer);
