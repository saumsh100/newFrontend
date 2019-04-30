
import React from 'react';
import PropTypes from 'prop-types';
import { A, Item, Box, Image, Span } from 'react-html-email';
import { formatPhoneNumber } from '@carecru/isomorphic';
import {
  SpaceTable,
  ItemCol,
  Address,
  Row,
  SocialLink,
  Copyright,
  CenterContainer,
} from '../../library';

const SocialContainer = ({ color, googlePlaceId, facebookUrl }) => {
  const googleHref = `https://search.google.com/local/writereview?placeid=${googlePlaceId}`;
  return (
    <CenterContainer>
      <Box align="center">
        <Row>
          <ItemCol>
            <SocialLink color={color}>
              <A href={facebookUrl}>
                <Image
                  alt="Facebook Link"
                  src="https://gallery.mailchimp.com/3a58791334fa8896539cb2841/images/4abac701-e491-40c4-8f35-3ac9b843197f.png"
                  width={9}
                  height={17}
                />
              </A>
            </SocialLink>
          </ItemCol>
          <ItemCol style={{ paddingLeft: '10px' }}>
            <SocialLink color={color}>
              <A href={googleHref}>
                <Image
                  alt="Google Link"
                  src="https://gallery.mailchimp.com/3a58791334fa8896539cb2841/images/ca94b822-c2d2-4210-aef0-46181d6d8a8f.png"
                  width={15}
                  height={15}
                />
              </A>
            </SocialLink>
          </ItemCol>
        </Row>
      </Box>
    </CenterContainer>
  );
};

SocialContainer.propTypes = {
  color: PropTypes.string.isRequired,
  googlePlaceId: PropTypes.string,
  facebookUrl: PropTypes.string,
};

SocialContainer.defaultProps = {
  googlePlaceId: '*|GOOGLE_URL|*',
  facebookUrl: '*|FACEBOOK_URL|*',
};

export default function Footer({ color, account }) {
  const linkStyle = {
    color: '#6c6c6c',
    textAlign: 'center',
    fontSize: '12px',
    textDecoration: 'none',
  };

  const defaultStyle = {
    color: '#6c6c6c',
    textAlign: 'center',
    fontSize: '12px',
    textDecoration: 'none',
  };

  return (
    <Item bgcolor="#313131" style={{ backgroundColor: '#313131' }}>
      <SpaceTable height={30} />

      <Address>
        <A href="#" style={defaultStyle} className="bottomDefaultText">
          {account.address.street}
        </A>
      </Address>

      <Address>
        <A href="#" style={defaultStyle} className="bottomDefaultText">
          {`${account.address.city}, ${account.address.state}`}
        </A>
      </Address>

      <SpaceTable height={20} />

      <Address>
        <A href={`tel:${account.phoneNumber}`} style={defaultStyle} className="bottomDefaultText">
          {formatPhoneNumber(account.phoneNumber)}
        </A>
      </Address>

      <Address>
        <A href={`mailto:${account.contactEmail}`} style={linkStyle} className="bottomDefaultText">
          <Span style={linkStyle} className="bottomDefaultText">
            {account.contactEmail}
          </Span>
        </A>
      </Address>

      <SpaceTable height={20} />

      <SocialContainer
        color={color}
        googlePlaceId={account.googlePlaceId || undefined}
        facebookUrl={account.facebookUrl || undefined}
      />

      <SpaceTable height={40} />

      <Copyright accountName={account.name} />

      <SpaceTable height={10} />
    </Item>
  );
}

Footer.propTypes = {
  color: PropTypes.string.isRequired,
  account: PropTypes.shape({
    name: PropTypes.string,
    contactEmail: PropTypes.string,
    phoneNumber: PropTypes.string,
    address: {
      city: PropTypes.string,
      state: PropTypes.string,
      street: PropTypes.string,
    },
    googlePlaceId: PropTypes.string,
    facebookUrl: PropTypes.string,
  }).isRequired,
};
