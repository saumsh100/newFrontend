
import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'react-html-email';
import ClinicEmailWrapper from '../../components/ClinicEmailWrapper';
import SharedComponent from './SharedComponent';
import SharedHeadersComponent from './SharedHeadersComponent';

export default function FamilyRemindersForAnotherMultiple(props) {
  const { appointmentDate, patient } = props;

  return (
    <ClinicEmailWrapper {...props}>
      <Item>
        <SharedHeadersComponent
          actionHeader={`Confirm your family's appointments on ${appointmentDate}.`}
          subHeader={`${
            patient.firstName
            }, this is a friendly reminder that the following family members have upcoming dental appointments with us.`}
        />
        <SharedComponent {...props} text="Confirm Appointments" />
      </Item>
    </ClinicEmailWrapper>
  );
}

FamilyRemindersForAnotherMultiple.propTypes = {
  appointmentDate: PropTypes.string.isRequired,
  patient: PropTypes.shape({ firstName: PropTypes.string }).isRequired,
};
