
import React from 'react';
import PropTypes from 'prop-types';
import dateFormatter from '../../../../../iso/helpers/dateTimezone/dateFormatter';
import dateFormatterFactory from '../../../../../iso/helpers/dateTimezone/dateFormatterFactory';
import { Icon, Well } from '../../../library/index';
import ClassyDiv from '../../../library/util/ClassyDiv';
import Section from '../Shared/Section';
import styles from './styles.scss';
import { accountShape, appointmentShape, reminderShape } from '../../../library/PropTypeShapes';

const WellHeader = ClassyDiv(styles.wellHeader);
const WellItem = ClassyDiv(styles.wellItem);

const buildAppointmentTime = ({ startDate, endDate, timezone }) => {
  const apptDateFormat = dateFormatterFactory('h:mma')(timezone);
  return `${apptDateFormat(startDate)} - ${apptDateFormat(endDate)}`;
};

const AppointmentsList = ({ appointments, timezone }) => (
  <Section>
    <WellHeader>{`Appointment${appointments.length > 1 ? 's' : ''} Information`}</WellHeader>
    {appointments.map(({ id, startDate, endDate, patient: { firstName, lastName } }) => (
      <Well key={id}>
        <WellItem>{`${firstName} ${lastName}`}</WellItem>
        <WellItem>{dateFormatter(startDate, timezone, 'dddd, MMMM Do YYYY')}</WellItem>
        <WellItem>
          {buildAppointmentTime({
            startDate,
            endDate,
            timezone,
          })}
        </WellItem>
      </Well>
    ))}
  </Section>
);

AppointmentsList.propTypes = {
  appointments: PropTypes.arrayOf(PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  })).isRequired,
  timezone: PropTypes.string.isRequired,
};

const tinyIconFactory = bookingWidgetPrimaryColor => props => (
  <Icon
    style={{ color: bookingWidgetPrimaryColor }}
    className={styles.tinyIcon}
    type="solid"
    {...props}
  />
);

export default function ConfirmedAppointment({
  params: {
    account: { address, phoneNumber, contactEmail, bookingWidgetPrimaryColor, website, timezone },
    appointments,
    reminder,
  },
}) {
  const { street, city, state } = address;

  const TinyIcon = tinyIconFactory(bookingWidgetPrimaryColor);

  return (
    <div>
      <Section>
        <div className={styles.header}>Thank you!</div>
        <div className={styles.text}>
          {`Your appointment${appointments.length > 1 ? 's have' : ' has'} been ${
            reminder.isCustomConfirm ? 'pre-confirmed' : 'confirmed'
          }.`}
        </div>
      </Section>
      <AppointmentsList appointments={appointments} timezone={timezone} />
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
    appointment: PropTypes.arrayOf(PropTypes.shape(appointmentShape)),
    reminder: PropTypes.shape(reminderShape),
  }).isRequired,
};
