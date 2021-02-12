
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Well, getFormattedDate } from '../../../library';
import ClassyDiv from '../../../library/util/ClassyDiv';
import Section from '../Shared/Section';
import { accountShape, appointmentShape } from '../../../library/PropTypeShapes';
import styles from './styles.scss';

const WellHeader = ClassyDiv(styles.wellHeader);
const WellItem = ClassyDiv(styles.wellItem);

const buildAppointmentTime = ({ startDate, endDate, timezone }) => {
  const apptDateFormat = datetime => getFormattedDate(datetime, 'h:mma', timezone);
  return `${apptDateFormat(startDate)} - ${apptDateFormat(endDate)}`;
};

const AppointmentsList = ({ appointments, timezone }) => (
  <Section>
    <WellHeader>{`Appointment${appointments.length > 1 ? 's' : ''} Information`}</WellHeader>
    {appointments.map(({ id, startDate, endDate, patient: { firstName, lastName } }) => (
      <Well key={id}>
        <WellItem>{`${firstName} ${lastName}`}</WellItem>
        <WellItem>{getFormattedDate(startDate, 'dddd, MMMM Do YYYY', timezone)}</WellItem>
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
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
  ).isRequired,
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
const ConfirmedAppointment = ({
  params: {
    account: { address, phoneNumber, contactEmail, bookingWidgetPrimaryColor, website },
    appointments,
    isCustomConfirm,
  },
}) => {
  const { street, city, state } = address;

  const TinyIcon = tinyIconFactory(bookingWidgetPrimaryColor);

  return (
    <div>
      <Section>
        <div className={styles.header}>Thank you!</div>
        <div className={styles.text}>
          {`Your appointment${appointments.length > 1 ? 's have' : ' has'} been ${
            isCustomConfirm ? 'pre-confirmed' : 'confirmed'
          }.`}
        </div>
      </Section>
      <AppointmentsList appointments={appointments} />
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
};

ConfirmedAppointment.propTypes = {
  params: PropTypes.shape({
    account: PropTypes.shape(accountShape),
    appointments: PropTypes.arrayOf(PropTypes.shape(appointmentShape)),
    isCustomConfirm: PropTypes.bool,
  }).isRequired,
};

export default ConfirmedAppointment;
