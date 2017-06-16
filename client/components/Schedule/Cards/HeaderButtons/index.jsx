
import React, { Component, PropTypes } from 'react';
import { Icon } from '../../../library';
import styles from '../../styles.scss';

export default function HeaderButtons(props) {
  const {
    addNewAppointment,
  } = props;

  return (
    <div className={styles.headerButtons}>
      <div className={styles.headerButtons__quickAdd} onClick={addNewAppointment}>
        Quick Add
        <Icon
          icon="plus"
          size={1.5}
          className={styles.headerButtons__quickAdd_icon}
        />
      </div>
    </div>
  );
}

HeaderButtons.PropTypes = {
  addNewAppointment: PropTypes.func,
};
