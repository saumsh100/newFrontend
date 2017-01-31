import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';

class InsuranceData extends Component {
  render() {
    const { patient } = this.props;
    if (!patient) {
      return <div className="loading">Loading...</div>;
    }
    return (
      <div className={styles.right__personal}>
        <div className={styles.insurance}>
          <div className={styles.insurance__header}>
            <div className={`${styles.insurance__company} ${styles.insurance__table}`}>
              <div className={styles.icon}>
                <i className="fa fa-medkit" />
              </div>
              <div className={styles.insurance__value}>SunLife</div>
            </div>
            <div className={`${styles.insurance__id} ${styles.insurance__table}`}>
              <div className={styles.insurance__title}>MEMBER ID</div>
              <div className={styles.insurance__value}>123-456-78</div>
            </div>
            <div className={`${styles.insurance__contact} ${styles.insurance__table}`}>
              <div className={styles.insurance__title}>CONTRACT #</div>
              <div className={styles.insurance__value}>9101-11213</div>
            </div>
            <div className={`${styles.insurance__carrier} ${styles.insurance__table}`}>
              <div className={styles.insurance__title}>CARRIER #</div>
              <div className={styles.insurance__value}>16</div>
            </div>
          </div>
          <div className={styles.insurance__footer}>
            <div className={`${styles.insurance__carrier} ${styles.insurance__table}`}>
              <div className={styles.icon}>
                <i className="fa fa-id-card-o" />
              </div>
              <div className={styles.insurance__title}>SIN</div>
              <div className={styles.insurance__value}>123 456 789</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InsuranceData;
