
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

export default function PatientRecalls({ recalls }) {
  return (
    <List className={styles.list}>
      {orderBy(recalls, 'sendDate').map((r) => {
        const {
          patient,
          primaryTypes,
          recall,
          sendDate,
        } = r;

        const { lastHygieneDate, lastRecallDate } = patient;

        // TODO: remove this, endpoint should calculate due date
        const dueForHygiene = moment(lastHygieneDate).add(6, 'months');
        const dueForRecall = moment(lastRecallDate).add(6, 'months');

        let type = recall.interval;
        if (type[0] === '-') {
          type = type.slice(1, type.length) + ' After';
        } else {
          type = type + ' Before';
        }

        return (
          <ListItem className={styles.listItem}>
            <div className={styles2.avatar}>
              <Avatar size="sm" user={patient} />
            </div>
            <div className={styles2.mediumCol}>
              {type}
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
              {dueForHygiene.format('MMM Do, YYYY, h:mm A')}
            </div>
          </ListItem>
        );
      })}

    </List>
  );
}


PatientRecalls.propTypes = {
};
