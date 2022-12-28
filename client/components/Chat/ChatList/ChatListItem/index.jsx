import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formatPhoneNumber } from '../../../../util/isomorphic';
import { Icon, ListItem, Avatar, getTodaysDate, getUTCDate } from '../../../library';
import { toggleFlagged, selectChat } from '../../../../thunks/chat';
import UnknownPatient from '../../unknownPatient';
import styles from './reskin-styles.scss';
import PreviewTooltipText from './PreviewTooltipText';
import Tooltip from '../../../Tooltip';

const getMessageTime = (message, timezone) =>
  getUTCDate(message, timezone).calendar(null, {
    sameDay: 'hh:mma',
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
    const {
      chat,
      patient,
      lastTextMessage,
      selectedChatId,
      timezone,
      pendingMessages,
      lastUserTextMessage,
    } = this.props;

    const botAvatar = {
      fullAvatarUrl: '/images/chatDonna.svg',
      bot: true,
    };

    const mDate = getUTCDate(lastTextMessage.createdAt || chat.updatedAt, timezone);
    const isActive = selectedChatId === chat.id;
    const messageDate = getMessageTime(mDate, timezone);
    const isUnread = chat.hasUnread;

    const listItemClass = styles.chatListItem;
    const hasFailed = lastTextMessage?.smsStatus === 'failed';
    const isFromPatient = lastTextMessage?.smsStatus === 'received';
    const user = lastTextMessage?.body !== '' ? lastTextMessage?.get('user') : '';
    const newUser = user?.size ? Object.fromEntries(user) : user;
    const lastUser = lastUserTextMessage?.body !== '' && lastUserTextMessage?.userId ? lastUserTextMessage?.get('user') : '';
    const newlastUser = lastUser?.size ? Object.fromEntries(lastUser) : lastUser;

    const message =
      lastTextMessage && lastTextMessage?.size
        ? lastTextMessage.get('body')
        : lastTextMessage?.body;
     
    let avatarUser;
    if (lastTextMessage?.body !== '') {
      avatarUser = !isFromPatient && newUser?.id ? newUser : newlastUser;
    }
    let lastTextMessageUser;
    if (!isFromPatient && lastTextMessage?.body) {
      lastTextMessageUser = newUser && newUser?.id ? newUser : botAvatar;
    }

    const finalbottomSectionUnread =
      user?.id || lastUser?.id ? styles.bottomSectionUnread : styles.noUserbottomSectionUnread;

    return (
      <ListItem
        selectedClass={styles.selectedChatItem}
        className={listItemClass}
        selectItem={isActive}
        onClick={this.selectChat}
      >
        <div className={styles.renderStar}>{this.renderStar(chat.isFlagged, this.toggleFlag)}</div>
        <div className={styles.avatar}>
          <Avatar
            className={classNames(
              {
                [styles.avatarIconUser]: !hasFailed && avatarUser,
                [styles.avatarIcon]: !avatarUser,
              },
              styles.avatarIcon,
            )}
            size="chatAvatar"
            user={patient}
          />
        </div>

        {!hasFailed && avatarUser ? (
          <Tooltip
            overlayClassName={styles.avatarTooltipContainer}
            trigger={['hover']}
            placement="below"
            tooltipPopover={styles.popover_tip}
            body={
              <PreviewTooltipText
                lastUserTextMessage={lastUserTextMessage}
                lastTextMessage={lastTextMessage}
                timezone={timezone}
                patient={patient}
                chat={chat}
              />
            }
          >
            <div className={styles.bottom_avatar}>
              <Avatar
                size="xs"
                className={styles.bubbleAvatar}
                user={avatarUser}
                isPatient={isFromPatient}
                textClassName={styles.bubbleAvatar_text}
              />
            </div>
          </Tooltip>
        ) : (
          ''
        )}

        <div className={styles.flexSection}>
          <div className={avatarUser && !hasFailed ? styles.userTopSection : styles.topSection}>
            <div className={isUnread ? styles.fullNameUnread : styles.fullName}>
              {this.renderPatient()}
            </div>
            <div className={isUnread ? styles.unreadTime : styles.time}>{messageDate}</div>
          </div>
          <div
            data-test-id="chat_lastMessage"
            className={
              isUnread
                ? finalbottomSectionUnread
                : user?.id || lastUser?.id
                ? styles.bottomSection
                : styles.noUserbottomSection
            }
          >
            {isActive && pendingMessages?.length !== 0 ? (
              <>
                <Icon className={styles.pendingIcon} icon="clock" size={2} type="solid" />
                <span className={styles.pendingMessage}>Sending Message...</span>
              </>
            ) : hasFailed ? (
              <div className={styles.notSentMessage}>
                <Icon
                  className={styles.avatar__failed}
                  icon="exclamation-circle"
                  size={2}
                  type="solid"
                />
                <span className={styles.failedMessage}>Message not sent</span>
              </div>
            ) : lastTextMessageUser ? (
              lastTextMessageUser.firstName ? (
                <>
                  <span className={styles.bottom_Userbody}>
                    <b>{lastTextMessageUser.firstName}:</b> {message}
                  </span>
                </>
              ) : (
                <span className={lastUser?.id ? styles.lastUser_bottom_body : styles.bottom_body}>
                  <b>Donna: </b>
                  {message}
                </span>
              )
            ) : (
              <span className={styles.patientMessage}>{message}</span>
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
    smsStatus: PropTypes.string,
  }).isRequired,
  lastUserTextMessage: PropTypes.shape({
    body: PropTypes.string,
    createdAt: PropTypes.string,
    userId: PropTypes.string,
  }).isRequired,
  chat: PropTypes.shape({
    id: PropTypes.string,
    patientId: PropTypes.string,
    lastTextMessageId: PropTypes.string,
    lastUserTextMessageId: PropTypes.string,
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
  const { lastTextMessageId, lastUserTextMessageId } = chat;
  const patients = state.entities.getIn(['patients', 'models']);
  const lastTextMessage = state.entities.getIn(['textMessages', 'models', lastTextMessageId]) || {
    body: '',
  };
  const lastUserTextMessage = state.entities.getIn([
    'textMessages',
    'models',
    lastUserTextMessageId,
  ]) || {
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
    lastUserTextMessage,
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
