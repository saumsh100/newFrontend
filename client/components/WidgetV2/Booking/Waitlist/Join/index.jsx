
import React from 'react';
import { Modal, Link } from '../../../../library';
import styles from './styles.scss';

function Join() {
  return (
    <Modal active className={styles.customDialog}>
      <h3 className={styles.title}>
        Want to be notified if an earlier appointment becomes available?
      </h3>
      <div className={styles.buttonsWrapper}>
        <Link to={'./select-date'} className={styles.confirmation}>
          Yes
        </Link>
        <Link to={'../login'} className={styles.negation}>
          No
        </Link>
      </div>
    </Modal>
  );
}

export default Join;
