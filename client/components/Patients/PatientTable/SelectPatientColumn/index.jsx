
import React, { Component, PropTypes } from 'react';
import { Checkbox } from '../../../library';

export default function SelectPatient(props) {
  const {
    patientIds,
    handlePatientSelection,
    id,
  } = props;

  const checked = patientIds.indexOf(id) > -1;

  return (
    <div>
      <Checkbox
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          handlePatientSelection(id);
        }}
      />
    </div>
  );
}
