import React, { Component, PropTypes } from 'react';
import styles from './main.scss';
import moment from 'moment';

class EditPersonalData extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className={styles.right__personal}>
        <div className={styles.personal}>
          <div className={`${styles.personal__name} ${styles.personal__table}`}>
            <i className="fa fa-user" />
            <input type="text" placeholder="First"/>
            <input type="text" placeholder="M"/>
            <input type="text" placeholder="Last"/>
          </div>
          <div className={`${styles.personal__info} ${styles.personal__table}`}>
            <div className={styles.personal__birthday}>
              <i className="fa fa-calendar" />
              <input type="text" placeholder="Birthday"/>
            </div>
            <div className={styles.personal__age}>
              <input type="text" placeholder="Age"/>
            </div>
            <div className={styles.personal__gender}>
              <input type="text" placeholder="Gender"/>
              <select>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>
          <div className={`${styles.personal__language} ${styles.personal__table}`}>
            <i className="fa fa-comments" />
            <input type="text" placeholder="Language"/>
            <select>
              <option>Eng</option>
              <option>Ua</option>
            </select>
          </div>
          <div className={`${styles.personal__status} ${styles.personal__table}`}>
            <i className="fa fa-flag" />
            <input type="text" placeholder="Status"/>
          </div>
        </div>
      </div>
    );
  }
}

export default EditPersonalData;
