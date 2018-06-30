
import React from 'react';
import styles from '../styles.scss';

export default function InsuranceForm() {
  return (
    <div className={styles.formContainer}>
      <div className={styles.disabledPage}>
        <div className={styles.disabledPage_text}>No Insurance Information</div>
      </div>
    </div>
  );
}
