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
    browserHistory.push(`/patients/${this.props.patientId}`);
  }
  render() {
    const { user, messages, patientList, patientId, lastMessage } = this.props;
    const patient = this.props.patientList.getIn(['models', user.id]);
    const patientMessages = this.props.messages.get('models')
    return (
      <li onClick={this.goToDialogue} className={styles.messages}>
        <img className={styles.messages__photo} src={patient.image} alt="avatar" />
        <div className={styles.messages__wrapper}>
          <div className={styles.messages__header}>
            <div className={styles.messages__name}>{patient.firstName}</div>
            <div className={styles.messages__date}>
              {moment(patient.lastUpdated).fromNow()}
            </div>
          </div>
          <div className={styles.messages__body}>
            <div className={styles.messages__unread}>
              <span>
                2
              </span>
            </div>
            <div className={styles.messages__text}>
              {lastMessage && lastMessage.body}
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
