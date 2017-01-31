import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';

class EditInsuranceData extends Component {
  render() {
    const { patient } = this.props;
    if (!patient) {
      return <div className="loading">Loading...</div>;
    }
    return (
      <div className={styles.right__personal}>
        <div className={styles.edit_insurance}>
          <form>
            <div className={styles.edit_insurance__header}>
              <div className={`${styles.edit_insurance__company} ${styles.edit_insurance__table}`}>
                <div className={styles.icon}>
                  <i className="fa fa-medkit" />
                </div>
                <input className={styles.edit_insurance__input} type="text" placeholder="Insurance" />
              </div>
              <div className={`${styles.edit_insurance__id} ${styles.edit_insurance__table}`}>
                <input className={styles.edit_insurance__input} type="text" placeholder="Member ID #" />

              </div>
              <div className={`${styles.edit_insurance__contact} ${styles.edit_insurance__table}`}>
                <input className={styles.edit_insurance__input} type="text" placeholder="Contract #" />

              </div>
              <div className={`${styles.edit_insurance__carrier} ${styles.edit_insurance__table}`}>
                <input className={styles.edit_insurance__input} type="text" placeholder="Carrier #" />
              </div>
            </div>
            <div className={styles.edit_insurance__footer}>
              <div className={`${styles.edit_insurance__carrier} ${styles.edit_insurance__table}`}>
                <div className={styles.icon}>
                  <i className="fa fa-id-card-o" />
                </div>
                <input className={styles.edit_insurance__input} type="text" placeholder="SIN #" />
              </div>
            </div>
            <input className={styles.edit_insurance__btn} type="submit" value="Save" />
          </form>
        </div>
      </div>
    );
  }
}

export default EditInsuranceData;
