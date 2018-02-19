
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import omit from 'lodash/omit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, ListItem, Avatar, Star } from '../../../library';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import styles from './styles.scss';

function FlaggedStar(props) {
  const { isFlagged } = props;
  const newIconProps = omit(props, 'isFlagged');
  return (
    <Icon
      {...newIconProps}
      icon="star"
      className={isFlagged ? styles.filled : styles.hallow}
      type={isFlagged ? 'solid' : 'light'}
    />
  );
}

class ChatListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      chat,
      patient,
      lastTextMessage,
      isActive,
      onSelect,
      onToggleFlag,
    } = this.props;

    const fullName = patient.firstName || patient.lastName ?
      (patient.birthDate ?
        (
          <div className={styles.nameAgeWrapper}>
            <div className={styles.nameWithAge}>
              {patient.firstName} {patient.lastName}
            </div>
            <div className={styles.age}>
              {` ${moment().diff(patient.birthDate, 'years')}`}
            </div>
          </div>
        ) : (
          <div className={styles.name}>
            {patient.firstName} {patient.lastName}
          </div>
        )
      ) : (
        <div className={styles.name}>
          {patient.mobilePhoneNumber}
        </div>
      );

    const mDate = moment(lastTextMessage.createdAt);
    const daysDifference = moment().diff(mDate, 'days');

    const messageDate = daysDifference ?
      mDate.format('YY/MM/DD') :
      mDate.format('h:mma');

    const hasUnread = !lastTextMessage.read;

    return (
      <ListItem
        selectedClass={styles.selectedChatItem}
        className={styles.chatListItem}
        selectItem={isActive}
        onClick={onSelect}
      >
        <div>
          <FlaggedStar
            isFlagged={chat.isFlagged}
            onClick={onToggleFlag}
          />
        </div>
        <div className={styles.avatar}>
          <Avatar
            size="sm"
            user={patient}
          />
        </div>
        <div className={styles.flexSection}>
          <div className={styles.topSection}>
            <div className={hasUnread ? styles.fullNameUnread : styles.fullName}>
              {fullName}
            </div>
            <div className={styles.time}>
              {messageDate}
            </div>
          </div>
          <div className={hasUnread ? styles.bottomSectionUnread : styles.bottomSection}>
            {lastTextMessage && lastTextMessage.body}
          </div>
        </div>
      </ListItem>
    );
  }
}

ChatListItem.propTypes = {
  lastTextMessage: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired,
  activeAccount: PropTypes.object,
  patient: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  onToggleFlag: PropTypes.func,
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

export default enhance(ChatListItem);
