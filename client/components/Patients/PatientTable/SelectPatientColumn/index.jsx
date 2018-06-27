
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '../../../library';
import styles from '../styles.scss';

export default function SelectPatient(props) {
  const { patientIds, handlePatientSelection, id } = props;

  const checked = patientIds.indexOf(id) > -1;
  const theme = {
    cbx: styles.cbxStyle,
  };

  return (
    <div className={styles.selectPatient}>
      <Checkbox
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          handlePatientSelection(id);
        }}
        theme={theme}
      />
    </div>
  );
}

SelectPatient.propTypes = {
  patientIds: PropTypes.arrayOf(String),
  handlePatientSelection: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
