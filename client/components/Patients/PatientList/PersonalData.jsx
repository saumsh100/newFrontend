import React, { Component, PropTypes } from 'react';
import styles from './main.scss';
import moment from 'moment';

class PersonalData extends Component {
  render() {
    const { patient } = this.props;
    if (!patient) {
      return <div>Loading...</div>;
    }
    return (
      <div className={styles.right__personal}>
        <div className={styles.personal}>
          <div className={`${styles.personal__name} ${styles.personal__table}`}>
            <i className="fa fa-user" />
            {console.log('curent - user', patient)}
            <span>{patient.name} </span>
          </div>
          <div className={`${styles.personal__info} ${styles.personal__table}`}>
            <div className={styles.personal__birthday}>
              <i className="fa fa-calendar" />
              <span>{patient.age}</span>
            </div>
            <div className={styles.personal__age}>
              <span>{moment(patient.age, "MM/DD/YYYY").month(0).from(moment().month(0))}</span>
            </div>
            <div className={styles.personal__gender}>
              <span>{patient.gender}</span>
            </div>
          </div>
          <div className={`${styles.personal__language} ${styles.personal__table}`}>
            <i className="fa fa-comments" />
            <span>{patient.language}</span>
          </div>
          <div className={`${styles.personal__status} ${styles.personal__table}`}>
            <i className="fa fa-flag" />
            <span>Active</span>
          </div>
        </div>
      </div>
    );
  }
}

export default PersonalData;
