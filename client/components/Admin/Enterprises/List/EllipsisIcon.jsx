import React from 'react';
import styles from './styles.scss';

const EllipsisIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 19 4"
    className={styles.ellipsis}
    fill="currentColor"
  >
    <ellipse cx="2.077" cy="2" rx="2.077" ry="2" />
    <ellipse cx="16.077" cy="2" rx="2.077" ry="2" />
    <ellipse cx="9.077" cy="2" rx="2.077" ry="2" />
  </svg>
);

export default EllipsisIcon;
