import React, { Component, PropTypes } from 'react';
import PatientListItem from './PatientListItem';
import PersonalData from './PersonalData'
import EditPersonalData from './EditPersonalData';
import InsuranceData from './InsuranceData';
import EditInsuranceData from './EditInsuranceData';
import moment from 'moment';
import styles from './main.scss';

import { Button, Form, Field } from '../../library';



class PatientList extends Component {
  render() {
    const { filters } = this.props;
    const patientNameFilterText = filters && filters.values && filters.values.patients;
    let patientList = this.props.patients.models.toArray()

    if (!!patientNameFilterText) {
      const pattern = new RegExp(patientNameFilterText, 'i');
      patientList = patientList.filter(d => pattern.test(d.name));
    }

    const patientListWithAppointments =
    patientList.filter((p) => (moment(p.lastAppointmentDate)._d
      .toString() !== "Invalid Date"))
      .sort((a,b) => (moment(a.toJS().lastAppointmentDate) > moment(b.toJS().lastAppointmentDate)));
    const patientListWithoutAppointments =
    patientList.filter((p) => (moment(p.lastAppointmentDate)._d
      .toString() === "Invalid Date"));
    const patientListSorted = patientListWithAppointments.concat(patientListWithoutAppointments);

    const patientListFiltered = patientListSorted
      .filter(n => (n.patientId === this.props.currentPatient))[0];
    const addNewUser = true ? <PersonalData patient={patientListFiltered} /> : <EditPersonalData />;
    return (
      <div className={styles.patients}>
        <div className={styles.patients_list}>
          <div className={`${styles.patients_list__search} ${styles.search}`}>
            <label className="search__label" htmlFor="search__input">
              <i className="fa fa-search" />
            </label>
            <Form form="patientList">
              <Field
                type="text"
                name="patients"
              />
            </Form>
          </div>
          <ul className={styles.patients_list__users}>
            {patientListSorted.map(user => {
              return (<PatientListItem
                key={user.patientId}
                user={user}
                currentPatient={this.props.currentPatient}
                setCurrentPatient={this.props.setCurrentPatient}
              />);
            })}
          </ul>
        </div>
        <div className={styles.patients_content}>
          <div className={styles.patients_content__header}>
            <div className={styles.patients_content__addUser}>
              Add New Patient
              <span>
                <i className="fa fa-plus" />
              </span>
            </div>
            <div className={styles.patient_profile}>
              <div className={styles.patient_profile__photo}>
                <img src="../img/patient-profile.png" alt="photo" />
              </div>
              <div className={`${styles.patient_profile__name} ${styles.personal__table}`}>
                <i className="fa fa-user" />
                <span>Claire Lacey, 6</span>
              </div>
              <div className={`${styles.patient_profile__info} ${styles.personal__table}`}>
                <div className={styles.personal__birthday}>
                  <i className="fa fa-calendar" />
                  <span>05/22/2010</span>
                </div>
                <div className={styles.personal__age}>
                  <span>6 years</span>
                </div>
                <div className={styles.personal__gender}>
                  <span>Female</span>
                </div>
              </div>
              <div className={`${styles.patient_profile__language} ${styles.personal__table}`}>
                <i className="fa fa-phone" />
                <span>123-456-7890</span>
              </div>
              <div className={`${styles.patient_profile__status} ${styles.personal__table}`}>
                <i className="fa fa-flag" />
                <span>claire123@gmail.com</span>
              </div>
            </div>
          </div>
          <div className={styles.patients_content__wrapper}>
            <div className={styles.left}></div>
            <div className={styles.right}>
              <ul className={styles.right__header}>
                <li className={`${styles.right__item} ${styles.right__item__active}`}>Personal</li>
                <li className={styles.right__item}>Contact</li>
                <li className={styles.right__item}>Insurance</li>
                <li className={styles.right__item}>Preferences</li>
              </ul>
              {addNewUser}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PatientList.propTypes = {
  patients: PropTypes.array.isRequired,
  setCurrentPatient: PropTypes.function
};

export default PatientList;
