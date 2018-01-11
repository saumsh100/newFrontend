
import React from 'react';
import moment from 'moment';
import {Card, Icon, Well} from '../../../library/index';
import ClassyDiv from '../../../library/util/ClassyDiv';
import Section from '../Shared/Section';
import getParameterByName from '../Shared/getParameterByName';
import styles from './styles.scss';

const WellHeader = ClassyDiv(styles.wellHeader);
const WellItem = ClassyDiv(styles.wellItem);

export default function ConfirmedAppointment({ params }) {
  const {
    account,
    appointment,
  } = params;

  const {
    address,
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
    <div>
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
    </div>
  );
}

ConfirmedAppointment.propTypes = {

};
