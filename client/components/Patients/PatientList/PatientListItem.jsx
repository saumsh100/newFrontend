import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import styles from './main.scss';
import styles2 from '../styles.scss';
import {
  ListItem, Avatar
} from '../../library';

class PatientListItem extends Component {
  constructor(props) {
    super(props);
    this.goToDialogue = this.goToDialogue.bind(this);
  }

  goToDialogue() {
    this.props.setCurrentPatient(this.props.user.patientId);
  }

  render() {
    const { user = {}, currentPatient } = this.props;
    const { startDate } = user.appointment;
    let showDate = startDate;

    if (moment(showDate)._d.toString() !== "Invalid Date") {
      showDate = moment(startDate).format('MMMM Do, YYYY');
    }

    const age = moment().diff(user.birthDate, 'years');

    const usersActiveClassName = classNames(
      styles.users,
      user.id === currentPatient.id ?
        styles.users__active :
        styles.users__noactive
    );

    const avatar = (user.avatarUrl ? user.avatarUrl : '/images/avatar.png');

    return (
      <ListItem
        onClick={this.goToDialogue}
        className={usersActiveClassName}
      >
        <Avatar className={styles.users__photo} user={user} />
        <div className={styles.users__wrapper}>
          <div className={styles.users__header}>
            <div className={styles2.users_name}>
              {user.firstName}&nbsp;{user.lastName},&nbsp;{age || 'N/A'}
            </div>

          </div>
          <div className={styles.users__body}>
            <div className={styles2.users_text}>
              Next Appt
              <div className={styles2.users_date}>
                {showDate}
              </div>
            </div>
          </div>
        </div>
      </ListItem>
    );
  }
}
PatientListItem.propTypes = {
  user: PropTypes.object.isRequired,
  currentPatient: PropTypes.object,
};

export default PatientListItem;
