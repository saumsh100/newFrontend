
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import {
  List,
  ListItem,
  Avatar
} from '../../../../library';
import styles from './styles.scss';
import styles2 from '../styles.scss';

export default function ReviewRequests({ reviews }) {
  return (
    <List className={styles.list}>
      {orderBy(reviews, 'sendDate').map((review) => {
        const {
          patient,
          primaryTypes,
          sendDate,
        } = review;

        const {
          appointment,
        } = patient;

        return (
          <ListItem
            key={`reviewRequest_${sendDate}_${patient.id}`}
            className={styles.listItem}
            data-test-id="list_donnaReviews"
          >
            <div className={styles2.avatar}>
              <Avatar size="sm" user={patient} />
            </div>
            <div className={styles2.smallCol}>
              {primaryTypes.join(' & ')}
            </div>
            <div className={styles2.smallCol}>
              {moment(sendDate).format('h:mm A')}
            </div>
            <div className={styles2.col}>
              {patient.firstName} {patient.lastName}
            </div>
            <div className={styles2.col}>
              {moment(appointment.startDate).format('MMM Do, YYYY - h:mm A')}
            </div>
          </ListItem>
        );
      })}
    </List>
  );
}


ReviewRequests.propTypes = {

};
