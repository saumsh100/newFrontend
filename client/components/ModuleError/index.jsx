import React from 'react';
import styles from './module-error.scss';

export default function index() {
  return (
    <div className={styles.errorWrapper}>
      <div>
        <img className={styles.errorImg} src="/images/ErrorMessage.png" alt="Error!" />
      </div>
      <div className={styles.header}>Uh oh, something went wrong...</div>
      <div className={styles.supportText}>
        Please try again. If the issue persists, please contact our support team.
      </div>
      <div className={styles.bottomText}>
        Contact us at <span className={styles.highlight}>1 (888) 870-0077</span> or{' '}
        <a href="mailto:support@carecru.com?subject=Bug report" className={styles.highlight}>
          support@carecru.com
        </a>
      </div>
    </div>
  );
}
