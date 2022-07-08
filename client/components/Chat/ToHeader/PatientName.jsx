import React from 'react';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from '../../../util/isomorphic';
import PatientPopover from '../../library/PatientPopover';
import RequestPopoverLoader from '../../library/RequestPopoverLoader';
import styles from './styles.scss';

export default function PatientName({ selectedPatient }) {
  const { isUnknown, isProspect, firstName, lastName, cellPhoneNumber } = selectedPatient;
  if (!isUnknown) {
    const fullName = `${firstName} ${lastName}`;
    return (
      <PatientPopover patient={selectedPatient}>
        <h2 className={styles.title}>{fullName}</h2>
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
    request: PropTypes.objectOf(PropTypes.any),
  }),
};
