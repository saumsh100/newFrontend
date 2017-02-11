import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import styles from './main.scss';

class PatientListItem extends Component {
  constructor(props) {
    super(props);
    this.goToDialogue = this.goToDialogue.bind(this);
  }
  goToDialogue() {
    this.props.setCurrentPatient(this.props.user.patientId)
  }
  render() {
    const { user, currentPatient } = this.props;
    const { lastAppointmentDate } = user;
    let showDate = lastAppointmentDate;
    if (moment(showDate)._d.toString() !== "Invalid Date") {
      showDate = moment(lastAppointmentDate).format("MMM Do YYYY")
    }
    const usersActiveClassName = classNames(
      styles.users,
      user.patientId == currentPatient ?
        styles.users__active :
        styles.users__noactive
    );
    return (
      <li onClick={this.goToDialogue} className={usersActiveClassName}>
        <img className={styles.users__photo} src={user.photo} alt="photo" />
        <div className={styles.users__wrapper}>
          <div className={styles.users__header}>
            <div className={styles.users__name}>
              {user.name}, {user.age}
            </div>
          </div>
          <div className={styles.users__body}>
            <div className={styles.users__text}>
              Last Appt
            </div>
            <div className={styles.users__appointment}>
              {showDate}
            </div>
          </div>
        </div>
      </li>
    );
  }
}
PatientListItem.propTypes = {
  user: PropTypes.object.isRequired,
};

export default PatientListItem;
