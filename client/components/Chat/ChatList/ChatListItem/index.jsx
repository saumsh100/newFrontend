import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formatPhoneNumber } from '../../../../util/isomorphic';
import { Icon, ListItem, Avatar, getTodaysDate, getUTCDate } from '../../../library';
import { toggleFlagged, selectChat } from '../../../../thunks/chat';
import UnknownPatient from '../../unknownPatient';
import styles from './styles.scss';

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
        type={isFlagged ? 'solid' : 'light'}
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
    const { chat, patient, lastTextMessage, selectedChatId, timezone } = this.props;

    const mDate = getUTCDate(lastTextMessage.createdAt || chat.updatedAt, timezone);
    const daysDifference = getTodaysDate(timezone).diff(mDate, 'days');
    const isActive = selectedChatId === chat.id;

    const messageDate = daysDifference ? mDate.format('YY/MM/DD') : mDate.format('h:mma');

    const isUnread = chat.hasUnread;

    const listItemClass = styles.chatListItem;

    return (
      <ListItem
        selectedClass={styles.selectedChatItem}
        className={listItemClass}
        selectItem={isActive}
        onClick={this.selectChat}
      >
        <div>{this.renderStar(chat.isFlagged, this.toggleFlag)}</div>
        <div className={styles.avatar}>
          <Avatar size="sm" user={patient} />
        </div>
        <div className={styles.flexSection}>
          <div className={styles.topSection}>
            <div className={isUnread ? styles.fullNameUnread : styles.fullName}>
              {this.renderPatient()}
            </div>
            <div className={styles.time}>{messageDate}</div>
          </div>
          <div
            data-test-id="chat_lastMessage"
            className={isUnread ? styles.bottomSectionUnread : styles.bottomSection}
          >
            {lastTextMessage && lastTextMessage.body}
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
};

function mapStateToProps(state, { chat = {} }) {
  const { lastTextMessageId } = chat;
  const patients = state.entities.getIn(['patients', 'models']);
  const lastTextMessage = state.entities.getIn(['textMessages', 'models', lastTextMessageId]) || {
    body: '',
  };

  const selectedChatId = state.chat.get('selectedChatId');

  return {
    selectedChatId,
    patient: patients.get(chat.patientId) || UnknownPatient(chat.patientPhoneNumber),
    lastTextMessage,
    timezone: state.auth.get('timezone'),
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
