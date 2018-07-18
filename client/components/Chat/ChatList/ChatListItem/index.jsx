
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, ListItem, Avatar } from '../../../library';
import { toggleFlagged, selectChat } from '../../../../thunks/chat';
import styles from './styles.scss';
import { isHub } from '../../../../util/hub';

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
        onClick={onClickListener}
        icon="star"
        className={isFlagged ? styles.filled : styles.hallow}
        type={isFlagged ? 'solid' : 'light'}
      />
    );
  }

  renderPatient() {
    const { patient } = this.props;

    return patient.firstName || patient.lastName ? (
      <div className={styles.nameAgeWrapper}>
        <div className={styles.nameWithAge}>
          {patient.firstName} {patient.lastName}
        </div>
        {patient.birthDate && (
          <div className={styles.age}>{moment().diff(patient.birthDate, 'years')}</div>
        )}
      </div>
    ) : (
      <div className={styles.name}>{patient.mobilePhoneNumber}</div>
    );
  }

  render() {
    const {
      chat, patient, lastTextMessage, hasUnread, selectedChatId,
    } = this.props;

    if (!patient || !lastTextMessage) {
      return null;
    }

    const mDate = moment(lastTextMessage.createdAt);
    const daysDifference = moment().diff(mDate, 'days');
    const isActive = selectedChatId === chat.id && !isHub();

    const messageDate = daysDifference ? mDate.format('YY/MM/DD') : mDate.format('h:mma');

    const isUnread = !isActive && hasUnread;

    const listItemClass = isHub() ? styles.hubListItem : styles.chatListItem;

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
          <div className={isUnread ? styles.bottomSectionUnread : styles.bottomSection}>
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
  }).isRequired,
  patient: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    birthDate: PropTypes.string,
  }).isRequired,
  hasUnread: PropTypes.bool,
  toggleFlagged: PropTypes.func.isRequired,
  selectChat: PropTypes.func.isRequired,
  selectedChatId: PropTypes.string,
  onChatClick: PropTypes.func,
};

ChatListItem.defaultProps = {
  hasUnread: false,
  selectedChatId: null,
  onChatClick: e => e,
};

function mapStateToProps(state, { chat = {} }) {
  const patients = state.entities.getIn(['patients', 'models']);
  const lastTextMessageId = chat.textMessages[chat.textMessages.length - 1];
  const lastTextMessage = state.entities.getIn(['textMessages', 'models', lastTextMessageId]);
  const hasUnread = chat.textMessages.filter((message) => {
    const messageEntity = state.entities.getIn(['textMessages', 'models', message]);
    return messageEntity && !messageEntity.read;
  });

  return {
    selectedChatId: state.chat.get('selectedChatId'),
    patient: patients.get(chat.patientId) || {},
    hasUnread: hasUnread.length > 0,
    lastTextMessage,
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

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(ChatListItem);
