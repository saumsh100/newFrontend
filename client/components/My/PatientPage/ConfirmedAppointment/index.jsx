
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Icon, Well } from '../../../library/index';
import ClassyDiv from '../../../library/util/ClassyDiv';
import Section from '../Shared/Section';
import styles from './styles.scss';
import { accountShape, appointmentShape, reminderShape } from '../../../library/PropTypeShapes';

const WellHeader = ClassyDiv(styles.wellHeader);
const WellItem = ClassyDiv(styles.wellItem);

export default function ConfirmedAppointment({ params }) {
  const { account, appointment, reminder } = params;

  const {
    address,
    phoneNumber,
    contactEmail,
    bookingWidgetPrimaryColor,
    website,
    timezone,
  } = account;

  const { street, city, state } = address;
  const { startDate, endDate } = appointment;

  const TinyIcon = props => (
    <Icon
      style={{ color: bookingWidgetPrimaryColor }}
      className={styles.tinyIcon}
      type="solid"
      {...props}
    />
  );

  const appointmentTime = `${moment.tz(startDate, timezone).format('h:mma')} -
  ${moment.tz(endDate, timezone).format('h:mma')}`;

  return (
    <div>
      <Section>
        <div className={styles.header}>Thank you!</div>
        <div className={styles.text}>
          Your appointment has been {reminder.isCustomConfirm ? 'pre-confirmed' : 'confirmed'}.
        </div>
      </Section>
      <Section>
        <WellHeader>Appointment Information</WellHeader>
        <Well>
          <WellItem>{moment.tz(startDate, timezone).format('dddd, MMMM Do YYYY')}</WellItem>
          <WellItem>{appointmentTime}</WellItem>
        </Well>
      </Section>
      <Section>
        <WellHeader>Practice Information</WellHeader>
        <Well>
          {contactEmail && (
            <WellItem>
              <TinyIcon icon="envelope" /> {contactEmail}
            </WellItem>
          )}
          {phoneNumber && (
            <WellItem>
              <TinyIcon icon="phone" /> {phoneNumber}
            </WellItem>
          )}
          {address && (
            <WellItem>
              <TinyIcon icon="map" /> {street}, {city}, {state}
            </WellItem>
          )}
          {website && (
            <WellItem>
              <TinyIcon icon="globe" /> {website}
            </WellItem>
          )}
        </Well>
      </Section>
    </div>
  );
}

ConfirmedAppointment.propTypes = {
  params: PropTypes.shape({
    account: PropTypes.shape(accountShape),
    appointment: PropTypes.shape(appointmentShape),
    reminder: PropTypes.shape(reminderShape),
  }).isRequired,
};
