import React from 'react';
import styles from './reskin-styles.scss';
import { Button } from '../library';

export default function index() {
  const tryAgainHandler = () => {
    window.location.reload();
  };
  return (
    <div className={styles.errorWrapper}>
      <div className={styles.header}>Uh oh, something went wrong...</div>
      <div className={styles.supportText}>
        Please try again. If the issue persists, please contact our support team.
      </div>
      <Button color="blue" rounded onClick={tryAgainHandler} className={styles.retryButton}>
        Try Again
      </Button>
      <div className={styles.bottomText}>
        <div>
          Contact us at <span className={styles.highlight}> 1 (888) 870-0077</span> or{' '}
          <a href="mailto:support@carecru.com?subject=Bug report" className={styles.highlight}>
            support@carecru.com
          </a>
        </div>
      </div>
    </div>
  );
}
