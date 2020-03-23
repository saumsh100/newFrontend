
import React from 'react';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from '@carecru/isomorphic';
import PatientPopover from '../../library/PatientPopover';

const PatientName = ({ selectedPatient }) => {
  const { isUnknown, firstName, lastName, cellPhoneNumber } = selectedPatient;
  return isUnknown ? (
    <span>{formatPhoneNumber(cellPhoneNumber)}</span>
  ) : (
    <PatientPopover patient={selectedPatient}>
      <span>
        <span>{firstName}</span>
        <span>{lastName}</span>
      </span>
    </PatientPopover>
  );
};
export default PatientName;

PatientName.defaultProps = {
  selectedPatient: {},
};

PatientName.propTypes = {
  selectedPatient: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    isUnknown: PropTypes.bool,
    cellPhoneNumber: PropTypes.string,
  }),
};
