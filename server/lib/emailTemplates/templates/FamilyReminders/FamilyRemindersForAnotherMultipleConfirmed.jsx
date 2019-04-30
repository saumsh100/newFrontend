
import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'react-html-email';
import ClinicEmailWrapper from '../../components/ClinicEmailWrapper';
import SharedComponent from './SharedComponent';
import SharedHeadersComponent from './SharedHeadersComponent';

export default function FamilyRemindersForAnotherMultipleConfirmed(props) {
  const { appointmentDate, patient } = props;

  return (
    <ClinicEmailWrapper {...props}>
      <Item>
        <SharedHeadersComponent
          actionHeader={`Appointment Reminder(s) for ${appointmentDate}.`}
          subHeader={`${
            patient.firstName
            }, this is a friendly reminder that the following family members have upcoming dental appointment(s) with us.`}
        />
        <SharedComponent {...props} />
      </Item>
    </ClinicEmailWrapper>
  );
}

FamilyRemindersForAnotherMultipleConfirmed.propTypes = {
  appointmentDate: PropTypes.string.isRequired,
  patient: PropTypes.shape({ firstName: PropTypes.string }).isRequired,
};
