import React, { Component, PropTypes } from 'react';
import { Icon } from '../../../library';
import styles from '../../styles.scss';

export default function HeaderButtons(props) {
  return (
    <div className={styles.headerButtons}>
      <div className={styles.headerButtons__text}>Sync ClearDent</div>
      <div className={styles.headerButtons__text}>Run Waitlist</div>
      <div className={styles.headerButtons__quickAdd}>
        Quick Add
        <span><Icon icon="plus" size={1} className={styles.headerButtons__quickAdd_icon}/></span>
      </div>
    </div>
  );
}
