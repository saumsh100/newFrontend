
import React from 'react';
import { Modal, Link } from '../../../../library';
import styles from './styles.scss';

function RemoveDates() {
  return (
    <Modal active className={styles.customDialog}>
      <h3 className={styles.title}>Do you need to remove a specific date from your waitlist?</h3>
      <div className={styles.buttonsWrapper}>
        <Link to={'./days-unavailable'} className={styles.confirmation}>
          Yes
        </Link>
        <Link to={'../login'} className={styles.negation}>
          No
        </Link>
      </div>
    </Modal>
  );
}

export default RemoveDates;
