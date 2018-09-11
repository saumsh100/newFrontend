
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Item } from 'react-html-email';
import {
  SpaceTable,
  MultipleDetails,
  Sincerely,
  SubHeaderContainer,
  SubHeader,
  CenterElement,
  Button,
} from '../../components/library';
import { formatPhoneNumber } from '../../../components/library/util/Formatters';

export default function SharedComponent({
  color,
  text,
  account,
  familyMembers,
  confirmationURL,
  patient,
  appointment,
}) {
  const linkStyle = {
    textAlign: 'center',
    color: '#808081',
    fontSize: 14,
    fontFamily: 'Roboto, sans-serif, Arial',
  };

  const accountPhoneNumberSubHeader = (
    <a style={linkStyle} href={`tel:${account.phoneNumber}`}>
      {formatPhoneNumber(account.phoneNumber)}
    </a>
  );

  const forSelfPlusFamily = appointment ? [patient].concat(familyMembers) : familyMembers;

  return (
    <Box width="100%">
      <Item>
        <MultipleDetails familyMembers={forSelfPlusFamily} timezone={account.timezone} />

        {color &&
          text && (
            <CenterElement colWidth={360}>
              <SpaceTable height={50} />
              <Button link={confirmationURL || '*|CONFIRMATION_URL|*'} text={text} color={color} />
            </CenterElement>
          )}

        <SubHeaderContainer>
          <SpaceTable height={50} />
          <SubHeader>
            If you need to reschedule an appointment, please call {accountPhoneNumberSubHeader}
          </SubHeader>
          <SpaceTable height={20} />
          <SubHeader>We look forward to seeing you soon.</SubHeader>
        </SubHeaderContainer>

        <Sincerely accountName={account.name} />
      </Item>
    </Box>
  );
}

SharedComponent.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string,
  familyMembers: PropTypes.arrayOf(PropTypes.shape({
    patient: {
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    },
  })).isRequired,
  account: PropTypes.shape({
    name: PropTypes.string,
    timezone: PropTypes.string,
  }).isRequired,
  confirmationURL: PropTypes.string,
  appointment: PropTypes.shape({ startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]) }),
  patient: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};

SharedComponent.defaultProps = {
  text: '',
  appointment: null,
  confirmationURL: '*|CONFIRMATION_URL|*',
};
