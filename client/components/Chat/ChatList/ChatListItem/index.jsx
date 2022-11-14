import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formatPhoneNumber } from '../../../../util/isomorphic';
import { Icon, ListItem, Avatar, getTodaysDate, getUTCDate } from '../../../library';
import { toggleFlagged, selectChat } from '../../../../thunks/chat';
import UnknownPatient from '../../unknownPatient';
import styles from './reskin-styles.scss';

const getMessageTime = (message, timezone) =>
  getUTCDate(message, timezone).calendar(null, {
    lastDay: '[Yesterday]',
    lastWeek: 'dddd',
    sameElse: 'YYYY-MM-DD',
  });

class ChatListItem extends Component {
  constructor(props) {
    super(props);

    this.toggleFlag = this.toggleFlag.bind(this);
    this.selectChat = this.selectChat.bind(this);
  }

  toggleFlag(e) {
    e.preventDefault();
    e.stopPropagation();
    const { id, isFlagged } = this.props.chat;
    this.props.toggleFlagged(id, isFlagged);
  }

  selectChat() {
    const { id } = this.props.chat;
    this.props.selectChat(id);
    this.props.onChatClick();
  }

  renderStar(isFlagged, onClickListener) {
    return (
      <Icon
        icon="star"
        onClick={onClickListener}
        className={isFlagged ? styles.filled : styles.hallow}
        type="solid"
      />
    );
  }

  renderPatient() {
    const { patient, timezone } = this.props;

    return patient.firstName || patient.lastName ? (
      <div className={styles.nameAgeWrapper}>
        <div data-test-id="chat_patientName" className={styles.nameWithAge}>
          {patient.isUnknown
            ? formatPhoneNumber(patient.cellPhoneNumber)
            : `${patient.firstName} ${patient.lastName}`}
        </div>
        {patient.birthDate && (
          <div className={styles.age}>
            {getTodaysDate(timezone).diff(patient.birthDate, 'years')}
          </div>
        )}
      </div>
    ) : (
      <div className={styles.name}>{formatPhoneNumber(patient.cellPhoneNumber)}</div>
    );
  }

  render() {
    const { chat, patient, lastTextMessage, selectedChatId, timezone, pendingMessages } =
      this.props;

    const botAvatar = {
      fullAvatarUrl: '/images/chatDonna.svg',
      bot: true,
    };

    const mDate = getUTCDate(lastTextMessage.createdAt || chat.updatedAt, timezone);
    const daysDifference = getTodaysDate(timezone).diff(mDate, 'days');
    const isActive = selectedChatId === chat.id;

    const messageDate = daysDifference ? getMessageTime(mDate, timezone) : mDate.format('hh:mma');

    const isUnread = chat.hasUnread;

    const listItemClass = styles.chatListItem;
    const hasFailed = lastTextMessage?.smsStatus === 'failed';
    const isFromPatient = lastTextMessage?.smsStatus === 'received';
    const user = lastTextMessage?.body !== '' ? lastTextMessage?.get('user') : '';
    const newUser = user?.size ? Object.fromEntries(user) : user;
    const message =
      lastTextMessage && lastTextMessage?.size
        ? lastTextMessage.get('body')
        : lastTextMessage?.body;

    let avatarUser;
    if (!isFromPatient && lastTextMessage?.body) {
      avatarUser = newUser && newUser?.id ? newUser : botAvatar;
    }

    return (
      <ListItem
        selectedClass={styles.selectedChatItem}
        className={listItemClass}
        selectItem={isActive}
        onClick={this.selectChat}
      >
        <div className={styles.renderStar}>{this.renderStar(chat.isFlagged, this.toggleFlag)}</div>
        <div className={styles.avatar}>
          <Avatar size="sm" user={patient} />
        </div>

        {isActive && pendingMessages?.length !== 0 && (
          <div className={styles.avatarPending}>
            <Icon className={styles.pendingIcon} icon="clock" size={2} type="solid" />
          </div>
        )}
        
          {!hasFailed && avatarUser ? (
            <div className={styles.bottom_avatar}>
            <Avatar
              size="xs"
              className={styles.bubbleAvatar}
              user={avatarUser}
              isPatient={isFromPatient}
              textClassName={styles.bubbleAvatar_text}
            />
        </div>):''}

        <div className={styles.flexSection}>
          <div className={lastTextMessage?.body ? styles.topSection : styles.topSectionNoBody}>
            <div className={isUnread ? styles.fullNameUnread : styles.fullName}>
              {this.renderPatient()}
            </div>
            <div className={isUnread ? styles.unreadTime : styles.time}>{messageDate}</div>
          </div>
          <div
            data-test-id="chat_lastMessage"
            className={isUnread ? styles.bottomSectionUnread : styles.bottomSection}
          >
            {isActive && pendingMessages?.length !== 0 && (
              <>
                <span className={styles.pendingMessage}>Sending Message...</span>
              </>
            )}

            {hasFailed ? (
              <>
                <Icon
                  className={styles.avatar__failed}
                  icon="exclamation-circle"
                  size={2}
                  type="solid"
                />
                <span className={styles.failedMessage}>Message not sent</span>
              </>
            ) : avatarUser ? (
              <>
                <span className={styles.bottom_body}>{message}</span>
              </>
            ) :  (
              message
            )}
          </div>
        </div>
      </ListItem>
    );
  }
}

ChatListItem.propTypes = {
  lastTextMessage: PropTypes.shape({
    read: PropTypes.bool,
    body: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  chat: PropTypes.shape({
    id: PropTypes.string,
    patientId: PropTypes.string,
    lastTextMessageId: PropTypes.string,
    isFlagged: PropTypes.bool,
    hasUnread: PropTypes.bool,
    updatedAt: PropTypes.string,
  }).isRequired,
  patient: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    birthDate: PropTypes.string,
    cellPhoneNumber: PropTypes.string,
    isUnknown: PropTypes.bool,
  }).isRequired,
  toggleFlagged: PropTypes.func.isRequired,
  selectChat: PropTypes.func.isRequired,
  selectedChatId: PropTypes.string,
  onChatClick: PropTypes.func,
  timezone: PropTypes.string.isRequired,
};

ChatListItem.defaultProps = {
  selectedChatId: null,
  onChatClick: (e) => e,
  pendingMessages: [],
};

function mapStateToProps(state, { chat = {} }) {
  const { lastTextMessageId } = chat;
  const patients = state.entities.getIn(['patients', 'models']);
  const lastTextMessage = state.entities.getIn(['textMessages', 'models', lastTextMessageId]) || {
    body: '',
  };

  const selectedChatId = state.chat.get('selectedChatId');
  const pendingMessages = state.chat.get('pendingMessages');

  return {
    selectedChatId,
    patient: patients.get(chat.patientId) || UnknownPatient(chat.patientPhoneNumber),
    lastTextMessage,
    timezone: state.auth.get('timezone'),
    pendingMessages,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleFlagged,
      selectChat,
    },
    dispatch,
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ChatListItem);
