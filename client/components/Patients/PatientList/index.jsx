import React, { Component, PropTypes } from 'react';
import PatientListItem from './PatientListItem';
import styles from './main.scss';

class PatientList extends Component {
  render() {
    const patients = [
      {
        patientId: 1,
        name: 'Claire Lacey',
        age: 6,
        lastAppointmentDate: 'Feb 1, 2017',
        photo: 'https://randomuser.me/api/portraits/women/62.jpg',
      }, {
        patientId: 2,
        name: 'Abraham Martin ',
        age: 23,
        lastAppointmentDate: 'Feb 2, 2017',
        photo: 'https://randomuser.me/api/portraits/women/63.jpg',
      }, {
        patientId: 3,
        name: 'Abraham Martin ',
        age: 43,
        lastAppointmentDate: 'Dec 31, 2016',
        photo: 'https://randomuser.me/api/portraits/women/65.jpg',
      }, {
        patientId: 4,
        name: 'Alice Andrews ',
        age: 18,
        lastAppointmentDate: 'Nov 12, 2015',
        photo: 'https://randomuser.me/api/portraits/women/65.jpg',
      },
      {
        patientId: 5,
        name: 'Claire Lacey',
        age: 6,
        lastAppointmentDate: 'Feb 1, 2017',
        photo: 'https://randomuser.me/api/portraits/women/62.jpg',
      }, {
        patientId: 6,
        name: 'Abraham Martin ',
        age: 23,
        lastAppointmentDate: 'Feb 2, 2017',
        photo: 'https://randomuser.me/api/portraits/women/63.jpg',
      }, {
        patientId: 7,
        name: 'Abraham Martin ',
        age: 43,
        lastAppointmentDate: 'Dec 31, 2016',
        photo: 'https://randomuser.me/api/portraits/women/65.jpg',
      }, {
        patientId: 8,
        name: 'Alice Andrews ',
        age: 18,
        lastAppointmentDate: 'Nov 12, 2015',
        photo: 'https://randomuser.me/api/portraits/women/65.jpg',
      },
    ];
    return (
      <div className={styles.patients}>
        <div className={styles.patients_list}>
          <div className={`${styles.patients_list__search} ${styles.search}`}>
            <label className="search__label" htmlFor="search__input">
              <i className="fa fa-search" />
            </label>
            <input id="search__input" className={styles.search__input} placeholder="Search..." />
            <div className={styles.search__edit}>
              <i className="fa fa-pencil" />
            </div>
          </div>
          <ul className={styles.patients_list__users}>
            {patients.map(((user) => {
                return (<PatientListItem user={user} />);
            }))}
          </ul>
        </div>
        <div className={styles.patients_content}>
          <div className={styles.patients_content__header}>
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
              <div className={styles.right__personal}>
                <div className={styles.personal}>
                  <div className={`${styles.personal__name} ${styles.personal__table}`}>
                    <i className="fa fa-user" />
                    <span>Claire K. Lacey</span>
                  </div>
                  <div className={`${styles.personal__info} ${styles.personal__table}`}>
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
                  <div className={`${styles.personal__language} ${styles.personal__table}`}>
                    <i className="fa fa-comments" />
                    <span>English</span>
                  </div>
                  <div className={`${styles.personal__status} ${styles.personal__table}`}>
                    <i className="fa fa-flag" />
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PatientList.propTypes = {
  patients: PropTypes.array.isRequired,
};

export default PatientList;
