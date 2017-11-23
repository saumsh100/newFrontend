
import React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function InfoDump(props) {
  const {
    label,
    data,
    className,
    component,
  } = props;

  const classes = classNames(className, styles.container);

  let dataClass = styles.data;

  if (!data && !component) {
    dataClass = classNames(dataClass, styles.noData)
  }

  if (component) {
    dataClass = null;
  }
  return (
    <div className={classes}>
      <div className={styles.label}>
        {label}
      </div>
      <div className={dataClass}>
        {data || component || 'n/a'}
      </div>
    </div>
  );
}
