
import React from 'react';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from '@carecru/isomorphic';
import PatientPopover from '../../library/PatientPopover';
import RequestPopoverLoader from '../../library/RequestPopoverLoader';

export default function PatientName({ selectedPatient }) {
  const { isUnknown, isProspect, firstName, lastName, cellPhoneNumber } = selectedPatient;
  if (!isUnknown) {
    return (
      <PatientPopover patient={selectedPatient}>
        <span>
          {firstName} {lastName}
        </span>
      </PatientPopover>
    );
  }

  return isProspect ? (
    <RequestPopoverLoader data={selectedPatient.request}>
      <span>
        Online Prospect: {firstName} {lastName}
      </span>
    </RequestPopoverLoader>
  ) : (
    <span>{formatPhoneNumber(cellPhoneNumber)}</span>
  );
}

PatientName.defaultProps = {
  selectedPatient: {},
};

PatientName.propTypes = {
  selectedPatient: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    isUnknown: PropTypes.bool,
    isProspect: PropTypes.bool,
    cellPhoneNumber: PropTypes.string,
  }),
};
