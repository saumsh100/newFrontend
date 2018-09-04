
import React from 'react';
import styles from './styles.scss';

export default function CopyrightFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <div className={styles.footer}>Copyright © {currentYear} CareCru Inc. All rights reserved.</div>
  );
}
