import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';

class EditPersonalData extends Component {
  render() {
    const { patient } = this.props;
    if (!patient) {
      return <div className={styles.loading}>Please select patient</div>;
    }
    return (
      <div className={styles.right__personal}>
        <div className={styles.edit_personal}>
          <form>
            <div className={`${styles.edit_personal__name} ${styles.edit_personal__table}`}>
              <div className={styles.edit_personal__icon}>
                <i className="fa fa-user" />
              </div>
              <div className={styles.edit_personal__name_wrapper}>
                <input className={styles.edit_personal__name_first} type="text" placeholder="First" />
                <input className={styles.edit_personal__name_m} type="text" placeholder="M" />
                <input className={styles.edit_personal__name_last} type="text" placeholder="Last" />
              </div>
            </div>
            <div className={`${styles.edit_personal__info} ${styles.edit_personal__table}`}>
              <div className={styles.edit_personal__info_header}>
                <div className={styles.edit_personal__icon}>
                  <i className="fa fa-calendar" />
                </div>
                <input className={styles.edit_personal__birthday} type="date" placeholder="Birthday" />
                <input className={styles.edit_personal__age} type="text" placeholder="Age" />
              </div>
              <div className={styles.edit_personal__gender}>
                <select>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
            <div className={`${styles.edit_personal__language} ${styles.edit_personal__table}`}>
              <div className={styles.edit_personal__icon}>
                <i className="fa fa-comments" />
              </div>
              <select>
                <option>Eng</option>
                <option>Ukr</option>
              </select>
            </div>
            <div className={`${styles.edit_personal__status} ${styles.edit_personal__table}`}>
              <div className={styles.edit_personal__icon}>
                <i className="fa fa-flag" />
              </div>
              <select>
                <option>Active</option>
                <option>Passive</option>
              </select>
            </div>
            <input className={styles.edit_personal__btn} type="submit" value="Save" />
          </form>
        </div>
      </div>
    );
  }
}

export default EditPersonalData;
