import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import styles from './main.scss';
import {
  ListItem,
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
    const { user, currentPatient } = this.props;
    const { startDate } = user.appointment;
    let showDate = startDate;

    if (moment(showDate)._d.toString() !== "Invalid Date") {
      showDate = moment(startDate).format('MMMM Do YYYY, h:mm a');
    }

    const age = moment().diff(user.birthDate, 'years');

    const usersActiveClassName = classNames(
      styles.users,
      user.id === currentPatient.id ?
        styles.users__active :
        styles.users__noactive
    );

    const avatar = (user.avatar ? user.avatar : 'https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png');

    return (
      <ListItem onClick={this.goToDialogue} className={usersActiveClassName}>
        <img className={styles.users__photo} src={avatar} alt="photo" />
        <div className={styles.users__wrapper}>
          <div className={styles.users__header}>
            <div className={styles.users__name}>
              {user.firstName} {user.lastName}, {age}
            </div>

          </div>
          <div className={styles.users__body}>
            <div className={styles.users__text}>
              <strong>Next Appt</strong>
              <br />
              {showDate}
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
