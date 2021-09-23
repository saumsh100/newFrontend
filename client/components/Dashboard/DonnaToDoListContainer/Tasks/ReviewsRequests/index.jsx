import React from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import classnames from 'classnames';
import { List, ListItem, Avatar, Icon, getFormattedDate } from '../../../../library';
import patientShape from '../../../../library/PropTypeShapes/patient';
import styles from './styles.scss';
import styles2 from '../styles.scss';
import PatientPopover from '../../../../library/PatientPopover';
import AppointmentPopover from '../../../../library/AppointmentPopover';

export default function ReviewRequests({ reviews, timezone, reviewsChannels }) {
  const channelText = reviewsChannels.join(' & ');
  return (
    <List className={styles.list}>
      {orderBy(reviews, 'sendDate').map((review) => {
        const { patient, sendDate } = review;
        const { appointment } = patient;

        return (
          <ListItem
            key={`reviewRequest_${sendDate}_${appointment.id}`}
            className={styles.listItem}
            data-test-id="list_donnaReviews"
          >
            <div className={styles2.avatar}>
              <Avatar size="sm" user={patient} />
            </div>
            <div className={styles2.col}>
              <span>
                <PatientPopover patient={patient}>
                  <div>{`${patient.firstName} ${patient.lastName}`}</div>
                </PatientPopover>
                <div className={classnames(styles.muted, styles.lowercase)}>
                  {`at ${getFormattedDate(sendDate, 'h:mm a', timezone)}`}
                </div>
              </span>
            </div>
            <div className={styles2.smallCol}>{channelText}</div>
            <div className={styles2.col}>
              <AppointmentPopover patient={patient} appointment={appointment}>
                <span>{getFormattedDate(appointment.startDate, 'MMM Do - h:mm A', timezone)}</span>
              </AppointmentPopover>
              <span
                className={classnames(styles.iconContainer, {
                  [styles.iconActive]: appointment.isPatientConfirmed,
                })}
              >
                {appointment.isPatientConfirmed && <Icon icon="check" />}
              </span>
            </div>
          </ListItem>
        );
      })}
    </List>
  );
}

ReviewRequests.propTypes = {
  reviewsChannels: PropTypes.arrayOf(PropTypes.string),
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      patient: PropTypes.shape(patientShape),
      sendDate: PropTypes.string,
    }),
  ),
  timezone: PropTypes.string.isRequired,
};

ReviewRequests.defaultProps = {
  reviews: [],
  reviewsChannels: [],
};
