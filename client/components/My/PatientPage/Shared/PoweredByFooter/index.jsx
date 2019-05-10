
import React from 'react';
import styles from './styles.scss';

export default function PoweredByFooter() {
  return (
    <div className={styles.footer}>
      <div>Powered By</div>
      <div>
        <img className={styles.logoCareCru} src="/images/carecru_logo.png" alt="CareCru Logo" />
      </div>
    </div>
  );
}
