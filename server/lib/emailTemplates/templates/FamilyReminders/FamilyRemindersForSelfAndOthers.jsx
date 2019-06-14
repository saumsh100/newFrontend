
import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'react-html-email';
import ClinicEmailWrapper from '../../components/ClinicEmailWrapper';
import SharedComponent from './SharedComponent';
import SharedHeadersComponent from './SharedHeadersComponent';

export default function FamilyRemindersForSelfAndOthers(props) {
  const { appointmentDate, patient, footerMessage } = props;

  return (
    <ClinicEmailWrapper {...props}>
      <Item>
        <SharedHeadersComponent
          actionHeader={`Confirm your appointment on ${appointmentDate}.`}
          subHeader={`${
            patient.firstName
          }, this is a friendly reminder that you and the following family members have upcoming dental appointments with us.`}
        />
        <SharedComponent {...props} text="Confirm Appointments" >
          {footerMessage}
        </SharedComponent>
      </Item>
    </ClinicEmailWrapper>
  );
}

FamilyRemindersForSelfAndOthers.propTypes = {
  appointmentDate: PropTypes.string.isRequired,
  patient: PropTypes.shape({ firstName: PropTypes.string }).isRequired,
  footerMessage: PropTypes.string.isRequired,
};
