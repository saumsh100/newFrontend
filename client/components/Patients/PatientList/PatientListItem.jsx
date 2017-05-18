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
    let showTime;

    if (moment(showDate)._d.toString() !== "Invalid Date") {
      showTime = moment(startDate).format('h:mm a');
      showDate = moment(startDate).format('MMMM Do YYYY');
    }

    const age = moment().diff(user.birthDate, 'years');

    const usersActiveClassName = classNames(
      styles.users,
      user.id === currentPatient.id ?
        styles.users__active :
        styles.users__noactive
    );
    return (
      <ListItem onClick={this.goToDialogue} className={usersActiveClassName}>
        <img className={styles.users__photo} src="https://placeimg.com/80/80/animals" alt="photo" />
        <div className={styles.users__wrapper}>
          <div className={styles.users__header}>
            <div className={styles.users__name}>
              {user.firstName} {user.lastName}, {age}
            </div>

          </div>
          <div className={styles.users__body}>
            <div className={styles.users__text}>
              <strong>Next Appt</strong> {showDate}
              <br />
              {showTime}
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
