import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';

class PersonalData extends Component {
  render() {
    const { patient } = this.props;
    if (!patient) {
      return <div className="loading">Loading...</div>;
    }
    return (
      <div className={styles.right__personal}>
        <div className={styles.personal}>
          <div className={`${styles.personal__name} ${styles.personal__table}`}>
            {console.log('curent - user', patient)}
            <div className={styles.personal__icon}>
              <i className="fa fa-user" />
            </div>
            <div className={styles.personal__value}>{patient.name}</div>
          </div>
          <div className={`${styles.personal__info} ${styles.personal__table}`}>
            <div className={styles.personal__birthday}>
              <div className={styles.personal__icon}>
                <i className="fa fa-calendar" />
              </div>
              <div className={styles.personal__value}>{patient.age}</div>
            </div>
            <div className={styles.personal__age}>
              <div className={styles.personal__value}>
                {moment(patient.age, "MM/DD/YYYY").month(0).from(moment().month(0))}
              </div>
            </div>
            <div className={styles.personal__gender}>
              <div className={styles.personal__value}>{patient.gender}</div>
            </div>
          </div>
          <div className={`${styles.personal__language} ${styles.personal__table}`}>
            <div className={styles.personal__icon}>
              <i className="fa fa-comments" />
            </div>
            <div className={styles.personal__value}>{patient.language}</div>
          </div>
          <div className={`${styles.personal__status} ${styles.personal__table}`}>
            <div className={styles.personal__icon}>
              <i className="fa fa-flag" />
            </div>
            <div className={styles.personal__value}>Active</div>
          </div>
        </div>
      </div>
    );
  }
}

export default PersonalData;
