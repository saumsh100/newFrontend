import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';
import styles from './DislogsList.scss';

class DialogsList extends Component {
  constructor(props) {
    super(props);
    this.goToDialogue = this.goToDialogue.bind(this);
  }
  goToDialogue() {
    browserHistory.push(`/patients/${this.props.patient.id}`);
  }
  render() {
    const { patient } = this.props;
    return (
      <li onClick={this.goToDialogue} className={styles.messages}>
        <img className={styles.messages__photo} src={patient.image} alt="avatar" />
        <div className={styles.messages__wrapper}>
          <div className={styles.messages__header}>
            <div className={styles.messages__name}>{patient.firstName}</div>
            <div className={styles.messages__date}>9:00am</div>
          </div>
          <div className={styles.messages__body}>
            <div className={styles.messages__unread}>
              <span>
                2
              </span>
            </div>
            <div className={styles.messages__text}>
              Lourem ipsum eccodi san deserif codi san deserif.
              Ipsum eccoesede desdjrdccodi s Lourem ipsum...
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
