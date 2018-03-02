
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '../../../library';
import styles from '../styles.scss';

export default function SelectAllPatients(props) {
  const {
    patientIds,
    selectAllPatients,
    maxPatients,
  } = props;

  const theme = {
    cbx: styles.cbxStyle,
  };

  return (
    <div className={styles.selectAll}>
      <Checkbox
        checked={patientIds.length === maxPatients && patientIds.length !== 0}
        onChange={selectAllPatients}
        theme={theme}
      />
    </div>
  );
}

SelectAllPatients.propTypes = {
  patientIds: PropTypes.instanceOf(Array),
  selectAllPatients: PropTypes.func.isRequired,
  maxPatients: PropTypes.number,
};
