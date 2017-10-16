
import React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function InfoDump(props) {
  const {
    label,
    data,
    className,
  } = props;

  let classes = classNames(className, styles.container);

  return (
    <div className={classes}>
      <div className={styles.label}>
        {label}
      </div>
      <div className={styles.data}>
        {data || '-'}
      </div>
    </div>
  );
}
