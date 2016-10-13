
import React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function MainRegion({ children }) {
  return (
    <div className={styles.leftSectionContainer}>
      {children}
    </div>
  );
}
