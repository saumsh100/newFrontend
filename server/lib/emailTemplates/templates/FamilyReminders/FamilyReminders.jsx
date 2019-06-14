
import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'react-html-email';
import ClinicEmailWrapper from '../../components/ClinicEmailWrapper';
import SharedComponent from './SharedComponent';
import SharedHeadersComponent from './SharedHeadersComponent';

export default function FamilyRemindersForAnotherMultiple(props) {
  const { actionHeader, subHeader, isConfirmed, footerMessage } = props;

  return (
    <ClinicEmailWrapper {...props}>
      <Item>
        <SharedHeadersComponent
          actionHeader={actionHeader}
          subHeader={subHeader}
        />
        <SharedComponent
          {...props}
          text={isConfirmed ? '' : 'Confirm Appointments'}
        >
          {footerMessage}
        </SharedComponent>
      </Item>
    </ClinicEmailWrapper>
  );
}

FamilyRemindersForAnotherMultiple.propTypes = {
  actionHeader: PropTypes.string.isRequired,
  subHeader: PropTypes.string.isRequired,
  isConfirmed: PropTypes.bool.isRequired,
  footerMessage: PropTypes.string.isRequired,
};
