
import React, { PropTypes } from 'react';
import Patients from '../components/Patients';

function PatientsContainer(props) {
  return <Patients {...props} />
}

PatientsContainer.propTypes = {};

export default PatientsContainer;
