import React from 'react';
import styles from '../styles.scss';

const MonthView = () => (
  <div className={styles.schedule}>
      <div className={`${styles.schedule__title} ${styles.title}`}>
          <div className={styles.title__side}>
              <div className={styles.title__month}>Wednesday</div>
              <div className={styles.title__day}>FEBRUARY</div>
          </div>
          <div className={styles.title__number}>15</div>
      </div>
        Monthly schedule
    </div>
);

export default MonthView;
