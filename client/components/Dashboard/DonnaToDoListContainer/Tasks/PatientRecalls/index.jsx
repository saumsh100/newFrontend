
import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import { List, ListItem, Avatar } from '../../../../library';
import { patientShape } from '../../../../library/PropTypeShapes';
import styles from './styles.scss';
import styles2 from '../styles.scss';

export default function PatientRecalls({ recalls, timezone }) {
  return (
    <List className={styles.list}>
      {orderBy(recalls, 'sendDate').map((r) => {
        const {
 patient, primaryTypes, recall, sendDate,
} = r;

        const { dueForHygieneDate, dueForRecallExamDate } = patient;
        let type = recall.interval;
        if (type[0] === '-') {
          type = `${type.slice(1, type.length)} After`;
        } else {
          type += ' Before';
        }

        return (
          <ListItem className={styles.listItem} key={`donnaToDoRecalls_${patient.id}`}>
            <div className={styles2.avatar}>
              <Avatar size="sm" user={patient} />
            </div>
            <div className={styles2.mediumCol}>{type}</div>
            <div className={styles2.smallCol}>{primaryTypes.join(' & ')}</div>
            <div className={styles2.smallCol}>{moment.tz(sendDate, timezone).format('h:mm A')}</div>
            <div className={styles2.col}>
              {patient.firstName} {patient.lastName}
            </div>
            <div className={styles2.col}>
              {dueForHygieneDate
                ? moment.tz(dueForHygieneDate, timezone).format('MMM Do, YYYY')
                : 'n/a'}
            </div>
            <div className={styles2.col}>
              {dueForRecallExamDate
                ? moment.tz(dueForRecallExamDate, timezone).format('MMM Do, YYYY')
                : 'n/a'}
            </div>
          </ListItem>
        );
      })}
    </List>
  );
}

PatientRecalls.propTypes = {
  recalls: PropTypes.arrayOf(PropTypes.shape({
    patient: PropTypes.shape(patientShape),
    primaryTypes: PropTypes.arrayOf(PropTypes.string),
    recall: PropTypes.shape(),
    sendDate: PropTypes.string,
  })),
  timezone: PropTypes.string.isRequired,
};

PatientRecalls.defaultProps = {
  recalls: [],
};
