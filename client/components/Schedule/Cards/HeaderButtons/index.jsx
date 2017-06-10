
import React, { Component, PropTypes } from 'react';
import { IconButton } from '../../../library';
import styles from '../../styles.scss';

export default function HeaderButtons(props) {
  const {
    addNewAppointment,
  } = props;

  return (
    <div className={styles.headerButtons}>
      <div className={styles.headerButtons__quickAdd} onClick={addNewAppointment}>
        Quick Add
        <span>
          <IconButton
            icon="plus"
            size={0.8}
            className={styles.headerButtons__quickAdd_icon}
          />
        </span>
      </div>
      <div>
        <IconButton icon="plus" onClick={(e)=>{
          e.stopPropagation()
          props.showAlert({ text: 'Created An Appointment', type: 'success' });
        }}/>
        <IconButton icon="plus" onClick={(e)=>{
          e.stopPropagation()
          props.showAlert({ text: 'Failed to Update', type: 'error' });
        }}/>
      </div>
    </div>
  );
}

HeaderButtons.PropTypes = {
  reinitializeState: PropTypes.func,
};
