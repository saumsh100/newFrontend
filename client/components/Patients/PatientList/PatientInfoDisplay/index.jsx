import React, { Component, PropTypes } from 'react';
import styles from '../main.scss';
import styles2 from '../../styles.scss';
import {
  Avatar, IconButton,
} from '../../../library';
import moment from 'moment';


class PatientInfoDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentPatient } = this.props;
    const id = (currentPatient.get ? currentPatient.get('id') : null);
    let avatar = (currentPatient.get ? currentPatient.get('avatarUrl') : null);
    const user = currentPatient;

    let showDate = null;

    if (moment(currentPatient.birthDate)._d.toString() !== "Invalid Date") {
      showDate = moment(currentPatient.birthDate).format('MMMM Do, YYYY')
    }
    const lastApp = (this.props.patientIdStats.lastAppointment ? moment(this.props.patientIdStats.lastAppointment).format('MMMM Do, YYYY') : 'N/A')

    let display = false;

    const age = moment().diff(currentPatient.birthDate, 'years');

    let nextApp = 'N/A';

    if (currentPatient.id !== null) {
      display = true;
      if (currentPatient.appointment.startDate) {
        nextApp = moment(currentPatient.appointment.startDate).format('MMMM Do, YYYY');
      }
    }

    return (
      <div className={styles.patients_content__header}>
        <div onClick={this.props.onClick} className={styles.patients_content__addUser} data-test-id="addNewPatient">
          Add New Patient
          <span>
            <i className="fa fa-plus" />
          </span>
        </div>
        {( display ? (
          <div className={styles.flex}>
            <div className={styles.patient_profile}>
              {/* <IconButton className={styles.deleteInfo} icon="trash-o" onClick={() => {if(confirm(`Delete ${currentPatient.firstName} ${currentPatient.lastName}?`)) {this.props.onDelete(id)}}} /> */}
              <div className={styles.patient_profile_avatarContainer}>
                <Avatar className={styles.patient_profile__photo} user={user} />
              </div>
              <div className={`${styles.patient_profile__name} ${styles.personal__table}`}>
                <p className={styles2.displayName}>
                  <span>{currentPatient.firstName} {currentPatient.lastName}</span>
                  <span>, {age || 'N/A'}</span>
                </p>
              </div>
              <div className={`${styles.patient_profile__info} ${styles.personal__table_info}`}>
                <div className={styles2.info}>
                  <span>{showDate}</span>
                </div>
                <div className={styles2.info}>
                  <span>{currentPatient.gender}</span>
                </div>
              </div>
              <div className={`${styles.patient_profile__language} ${styles.personal__table}`}>
                <div className={styles2.contact}>
                  <span><i className="fa fa-phone" style={{ color: '#ff715a' }} />&emsp; {currentPatient.mobilePhoneNumber}</span>
                  <br />
                  <span><i className="fa fa-flag" style={{ color: '#ff715a' }} />&emsp;{currentPatient.email}</span>
                </div>
              </div>
              <div className={styles.appointment}>
                <div>
                  <div className={styles2.info_footer}>
                    <span>Last Appointment</span>
                  </div>
                  <div>
                    <span className={styles.info}><strong>{lastApp}</strong></span>
                  </div>
                </div>
                <div >
                  <div className={styles2.info_footer}>
                    <span>Next Appointment</span>
                  </div>
                  <div className={styles.end}>
                    <span className={styles.info}>{nextApp}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.stats}>
              <div className={styles.loyal}>
                {/*<div className={styles.container1}>
                  <span className={styles.loyality1}>{this.props.patientIdStats.allApps * this.props.patientIdStats.monthsApp}</span>
                  <br />
                  <span className={styles.loyality2}>PATIENT</span>
                  <br />
                  <span className={styles.loyality3}>LOYALTY</span>
                </div>*/}
                <div className={styles.container1}>
                  <span className={styles.statInfo}>TOTAL APPOINTMENTS</span>
                  <br />
                  <span className={styles.statData}>{this.props.patientIdStats.allApps}</span>
                  <br />
                  <br />
                  <span className={styles.statInfo}>APPOINTMENTS LAST YEAR</span>
                  <br />
                  <span className={styles.statData}>{this.props.patientIdStats.monthsApp}</span>
                  <br />
                  <br />
                  {/*<span className={styles.statInfo}>REFERRALS SENT</span>
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
                  <span className={styles.statData}>2</span>*/}
                </div>
              </div>
            </div>
          </div>) : null) }
      </div>
    );
  }
}

PatientInfoDisplay.propTypes = {
  patientIdStats: PropTypes.object,
  currentPatient: PropTypes.object,
  onDelete: PropTypes.func,
};
export default PatientInfoDisplay;
