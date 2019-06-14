
import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'react-html-email';
import ClinicEmailWrapper from '../../components/ClinicEmailWrapper';
import SharedComponent from './SharedComponent';
import SharedHeadersComponent from './SharedHeadersComponent';

export default function FamilyRemindersForSelfAndOthersConfirmed(props) {
  const { appointmentDate, patient, footerMessage } = props;

  return (
    <ClinicEmailWrapper {...props}>
      <Item>
        <SharedHeadersComponent
          actionHeader={`Appointment Reminder for ${appointmentDate}.`}
          subHeader={`${
            patient.firstName
          }, this is a friendly reminder that you and the following family members have upcoming dental appointments with us.`}
        />
        <SharedComponent {...props} >
          {footerMessage}
        </SharedComponent>
      </Item>
    </ClinicEmailWrapper>
  );
}

FamilyRemindersForSelfAndOthersConfirmed.propTypes = {
  appointmentDate: PropTypes.string.isRequired,
  patient: PropTypes.shape({ firstName: PropTypes.string }).isRequired,
  footerMessage: PropTypes.string.isRequired,
};
