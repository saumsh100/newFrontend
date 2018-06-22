
import React from 'react';
import styles from './styles.scss';

export default function NavRegion({ children }) {
  return <div className={styles.navListWrapper}>{children}</div>;
}
