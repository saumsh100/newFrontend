
import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import { List, ListItem, Avatar } from '../../../../library';
import patientShape from '../../../../library/PropTypeShapes/patient';
import styles from './styles.scss';
import styles2 from '../styles.scss';

export default function ReviewRequests({ reviews, timezone }) {
  return (
    <List className={styles.list}>
      {orderBy(reviews, 'sendDate').map((review) => {
        const { patient, primaryTypes, sendDate } = review;

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
            <div className={styles2.smallCol}>{primaryTypes.join(' & ')}</div>
            <div className={styles2.smallCol}>{moment.tz(sendDate, timezone).format('h:mm A')}</div>
            <div className={styles2.col}>
              {patient.firstName} {patient.lastName}
            </div>
            <div className={styles2.col}>
              {moment.tz(appointment.startDate, timezone).format('MMM Do, YYYY - h:mm A')}
            </div>
          </ListItem>
        );
      })}
    </List>
  );
}

ReviewRequests.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    patient: PropTypes.shape(patientShape),
    primaryTypes: PropTypes.arrayOf(PropTypes.string),
    sendDate: PropTypes.string,
  })),
  timezone: PropTypes.string.isRequired,
};

ReviewRequests.defaultProps = {
  reviews: [],
};
