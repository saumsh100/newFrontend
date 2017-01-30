import React, { Component, PropTypes } from 'react';
import styles from './main.scss';
import moment from 'moment';
class PatientListItem extends Component {
  render() {
    const { user } = this.props;
    const { lastAppointmentDate } = user;
    let showDate = lastAppointmentDate; 
    if (moment(showDate)._d.toString() !== "Invalid Date") {
      showDate = moment(lastAppointmentDate).format("MMM Do YYYY")
    }
    return (
      <li className={styles.users}>
        <img className={styles.users__photo} src={user.photo} alt="user photo" />
        <div className={styles.users__wrapper}>
          <div className={styles.users__header}>
            <div className={styles.users__name}>
              {user.name}
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
