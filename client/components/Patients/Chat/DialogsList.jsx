import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';
import styles from './DislogsList.scss';

class DialogsList extends Component {
  constructor(props) {
    super(props);
    this.goToDialogue = this.goToDialogue.bind(this);
  }
  goToDialogue() {
    this.props.setCurrentDialog(this.props.patientId)
  }
  render() {
    const {
      patientId,
      lastMessageText,
      unreadCount,
      patientName,
      lastMessageTime,
    } = this.props;
    debugger;
    const patient = {}
    return (
      <li onClick={this.goToDialogue} className={styles.messages}>
        <img className={styles.messages__photo} src={patient.image} alt="avatar" />
        <div className={styles.messages__wrapper}>
          <div className={styles.messages__header}>
            <div className={styles.messages__name}>{patientName}</div>
            <div className={styles.messages__date}>
              {lastMessageTime && moment(lastMessageTime).fromNow()}
            </div>
          </div>
          <div className={styles.messages__body}>
            {!!unreadCount &&
              <div className={styles.messages__unread}>
                <span>
                  {unreadCount}
                </span>
              </div>
            }
            <div className={styles.messages__text}>
              {lastMessageText}
            </div>
          </div>
        </div>
      </li>
    );
  }
}

DialogsList.PropTypes = {
  patient: PropTypes.object,
};

export default DialogsList;
