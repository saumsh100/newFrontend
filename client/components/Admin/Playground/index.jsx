
import React from 'react';
import TimezoneFormatter from '../../Utils/TimezoneFormatter';

import styles from './styles.scss';

export default function Playground() {
  return (
    <div className={styles.page}>
      <TimezoneFormatter
        date={new Date()}
        format="MMM dd YYYY"
        render={({ formattedDate }) => <span>{formattedDate}</span>}
      />
    </div>
  );
}
