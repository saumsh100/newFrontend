import React, { Component, PropTypes } from 'react';
import styles from '../main.scss';
import {
  Avatar,
} from '../../../library';
import moment from 'moment';


class PatientInfoDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentPatient } = this.props;
    console.log(currentPatient);

    let showDate = null;

    if (moment(currentPatient.birthDate)._d.toString() !== "Invalid Date") {
      showDate = moment(currentPatient.birthDate).format('MMMM Do YYYY')
    }

    const lastApp = moment(currentPatient.lastAppointmentDate).format('MMMM Do YYYY');

    let display = false;

    const age = moment().diff(currentPatient.birthDate, 'years');

    let nextApp;


    if (currentPatient.id !== null) {
      display = true;
      nextApp = moment(currentPatient.appointment.startDate).format('MMMM Do YYYY');
    }

    return (
      <div className={styles.patients_content__header}>
        <div className={styles.patients_content__addUser}>
          Add New Patient
          <span>
                        <i className="fa fa-plus" />
                      </span>
        </div>
        {( display ? (
          <div className={styles.flex}>
            <div className={styles.patient_profile}>
              <Avatar className={styles.patient_profile__photo} url="https://placeimg.com/640/480/people" />
              <div className={`${styles.patient_profile__name} ${styles.personal__table}`}>
                <span className={styles.name}>{currentPatient.firstName} {currentPatient.lastName}, {age}</span>
              </div>
              <div className={`${styles.patient_profile__info} ${styles.personal__table_info}`}>
                <div className={styles.info}>
                  <span>{showDate}</span>
                </div>
                <div className={styles.info}>
                  <span>{currentPatient.gender}</span>
                </div>
              </div>
              <div className={`${styles.patient_profile__language} ${styles.personal__table}`}>
                <div className={styles.contact}>
                  <span><i className="fa fa-phone" style={{ color: '#ff715a' }} />&emsp; {currentPatient.phoneNumber}</span>
                  <br />
                  <span><i className="fa fa-flag" style={{ color: '#ff715a' }} />&emsp;{currentPatient.email}</span>
                </div>
              </div>
              <div className={styles.appointment}>
                <div className={styles.info}>
                  <div>
                    <span>Last Appointment</span>
                  </div>
                  <div>
                    <span><strong>{lastApp}</strong></span>
                  </div>
                </div>
                <div className={styles.info}>
                  <div>
                    <span>Next Appointment</span>
                  </div>
                  <div className={styles.end}>
                    <span><strong>{nextApp}</strong></span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.stats}>
              <div className={styles.loyal}>
                <div className={styles.container1}>
                  <span className={styles.loyality1}>70</span>
                  <br />
                  <span className={styles.loyality2}>PATIENT</span>
                  <br />
                  <span className={styles.loyality3}>LOYALTY</span>
                </div>
                <div className={styles.container2}>
                  <span className={styles.statInfo}>TOTAL APPOINTMENTS</span>
                  <br />
                  <span className={styles.statData}>15</span>
                  <br />
                  <br />
                  <span className={styles.statInfo}>APPOINTMENTS LAST YEAR</span>
                  <br />
                  <span className={styles.statData}>2</span>
                  <br />
                  <br />
                  <span className={styles.statInfo}>REFERRALS SENT</span>
                  <br />
                  <span className={styles.statData}>7</span>
                  <br />
                  <br />
                  <span className={styles.statInfo}>REFERRALS CONFIRMED</span>
                  <br />
                  <span className={styles.statData}>3</span>
                  <br />
                  <br />
                  <span className={styles.statInfo}>REVIEWS</span>
                  <br />
                  <span className={styles.statData}>2</span>
                </div>
              </div>
            </div>
          </div>) : null) }
      </div>
    );
  }
}

PatientInfoDisplay.propTypes = {
  currentPatient: PropTypes.object,
};
export default PatientInfoDisplay;
