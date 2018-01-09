
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Card, Well, Icon } from '../library';
import ClassyDiv from '../library/util/ClassyDiv';
import styles from './styles.scss';

export function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }

  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const Section = ClassyDiv(styles.section);
const PoweredByFooter = () => (
  <div className={styles.footer}>
    <div>Powered By</div>
    <div>
      <img
        className={styles.logoCareCru}
        src="/images/carecru_logo.png"
        alt="CareCru Logo"
      />
    </div>
  </div>
);

const WellHeader = ClassyDiv(styles.wellHeader);
const WellItem = ClassyDiv(styles.wellItem);

export default function ConfirmedAppointment() {
  let params = getParameterByName('params');
  params = Buffer.from(params, 'base64').toString('utf8');
  params = JSON.parse(params);

  const {
    account,
    appointment,
  } = params;

  const {
    address,
    fullLogoUrl,
    phoneNumber,
    contactEmail,
    bookingWidgetPrimaryColor,
    website,
  } = account;

  const { street, city, state } = address;
  const { startDate, endDate } = appointment;

  const TinyIcon = (props) => (
    <Icon
      style={{ color: bookingWidgetPrimaryColor }}
      className={styles.tinyIcon}
      type="solid"
      {...props}
    />
  );

  return (
    <div className={styles.backDrop}>
      <Card style={{ borderTop: `5px solid ${bookingWidgetPrimaryColor}` }} className={styles.centerWrapper}>
        <Section>
          {fullLogoUrl ?
            <img
              className={styles.logoClinic}
              src={fullLogoUrl}
              alt="Logo"
            /> : null}
        </Section>
        <Section>
          <div className={styles.header}>Thank you!</div>
          <div className={styles.text}>Your appointment has been confirmed.</div>
        </Section>
        <Section>
          <WellHeader>
            Appointment Information
          </WellHeader>
          <Well>
            <WellItem>{moment(startDate).format('dddd, MMMM Do YYYY')}</WellItem>
            <WellItem>{moment(startDate).format('h:mma')} - {moment(endDate).format('h:mma')}</WellItem>
          </Well>
        </Section>
        <Section>
          <WellHeader>
            Practice Information
          </WellHeader>
          <Well>
            {contactEmail ? (<WellItem><TinyIcon icon="envelope" /> {contactEmail}</WellItem>) : null}
            {phoneNumber ? (<WellItem><TinyIcon icon="phone" /> {phoneNumber}</WellItem>) : null}
            {address ? (<WellItem><TinyIcon icon="map" /> {street}, {city}, {state}</WellItem>) : null}
            {website ? (<WellItem><TinyIcon icon="globe" /> {website}</WellItem>) : null}
          </Well>
        </Section>
        <div className={styles.spaceFiller} />
        <PoweredByFooter />
      </Card>
    </div>
  );
}

ConfirmedAppointment.propTypes = {

};
