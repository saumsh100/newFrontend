
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

        const { dueForHygieneDate, dueForRecallExamDate } = patient;
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
              {dueForHygieneDate ?
                moment(dueForHygieneDate).format('MMM Do, YYYY') :
                'n/a'
              }
            </div>
            <div className={styles2.col}>
              {dueForRecallExamDate ?
                moment(dueForRecallExamDate).format('MMM Do, YYYY') :
                'n/a'
              }
            </div>
          </ListItem>
        );
      })}

    </List>
  );
}


PatientRecalls.propTypes = {
};
