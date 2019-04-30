
import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'react-html-email';
import ClinicEmailWrapper from '../../components/ClinicEmailWrapper';
import SharedComponent from './SharedComponent';
import SharedHeadersComponent from './SharedHeadersComponent';

export default function FamilyRemindersForAnotherSingleConfirmed(props) {
  const { appointmentDate, patient, familyMembers } = props;

  const familyPatient = familyMembers[0];

  return (
    <ClinicEmailWrapper {...props}>
      <Item>
        <SharedHeadersComponent
          actionHeader={`Appointment reminder for ${appointmentDate}.`}
          subHeader={`${patient.firstName}, this is a friendly reminder that ${
            familyPatient.firstName
          } ${familyPatient.lastName} has an upcoming dental appointment with us.`}
        />
        <SharedComponent {...props} />
      </Item>
    </ClinicEmailWrapper>
  );
}

FamilyRemindersForAnotherSingleConfirmed.propTypes = {
  appointmentDate: PropTypes.string.isRequired,
  patient: PropTypes.shape({ firstName: PropTypes.string }).isRequired,
  familyMembers: PropTypes.arrayOf(PropTypes.shape({
    patient: {
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    },
  })).isRequired,
};
