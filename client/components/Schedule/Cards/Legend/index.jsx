
import React, { PropTypes } from 'react';
import { Icon } from '../../../library';
import styles from '../../styles.scss';

export default function Legend() {
  return (
    <div className={styles.legend}>
      <div className={styles.legend_icon_clock}><Icon icon="clock-o" /></div>
      <div className={styles.legend_text}>Reminders Sent</div>
      <div className={styles.legend_icon_check}><Icon icon="check-circle-o" /></div>
      <div className={styles.legend_text}>Reminders Confirmed</div>
      <div className={styles.legend_icon_square}><Icon icon="square" /></div>
      <div className={styles.legend_text_newAppt}>New Appt Request</div>
      <div className={styles.legend_icon_squareO}>
        <span className={styles.legend_icon_gradient}>&nbsp;</span>
        <Icon icon="square" />
      </div>
      <div className={styles.legend_text}>PMS Not Synced</div>
    </div>
  );
}
