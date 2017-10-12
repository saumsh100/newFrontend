
import React from 'react';
import styles from './styles.scss';

export default function InfoDump(props) {
  const {
    label,
    data,
  } = props;

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        {label}
      </div>
      <div className={styles.data}>
        {data}
      </div>
    </div>
  );
}
