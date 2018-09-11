
import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'react-html-email';
import { SpaceTable, CenterContainer } from '../../library';

export default function Header(props) {
  const { maxWidth, account } = props;

  const accountLogoUrl =
    typeof account.fullLogoUrl === 'string' && account.fullLogoUrl.replace('[size]', 'original');

  const link1 =
    'https://gallery.mailchimp.com/3a58791334fa8896539cb2841/images/b46b23df-6cab-47af-91f5-ee8cb4fc2628.png';

  return (
    <Item>
      <CenterContainer height={60} colWidth={140} maxWidth={maxWidth} className="clinicLogo">
        <SpaceTable height={55} />
        <img alt="Clinic Logo" src={accountLogoUrl || link1} height="40px" width="auto" />
      </CenterContainer>
      <SpaceTable height={50} />
    </Item>
  );
}

Header.propTypes = {
  maxWidth: PropTypes.number.isRequired,
  account: PropTypes.shape({ fullLogoUrl: PropTypes.string }).isRequired,
};
