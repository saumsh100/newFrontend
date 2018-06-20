
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import { List, ListItem, Avatar } from '../../../../library';
import { patientShape } from '../../../../library/PropTypeShapes';
import styles from './styles.scss';
import styles2 from '../styles.scss';

export default function PatientRecalls({ recalls }) {
  return (
    <List className={styles.list}>
      {orderBy(recalls, 'sendDate').map((r, index) => {
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
          <ListItem className={styles.listItem} key={`donnaToDoRecalls_${r.id || index}`}>
            <div className={styles2.avatar}>
              <Avatar size="sm" user={patient} />
            </div>
            <div className={styles2.mediumCol}>{type}</div>
            <div className={styles2.smallCol}>{primaryTypes.join(' & ')}</div>
            <div className={styles2.smallCol}>{moment(sendDate).format('h:mm A')}</div>
            <div className={styles2.col}>
              {patient.firstName} {patient.lastName}
            </div>
            <div className={styles2.col}>
              {dueForHygieneDate ? moment(dueForHygieneDate).format('MMM Do, YYYY') : 'n/a'}
            </div>
            <div className={styles2.col}>
              {dueForRecallExamDate ? moment(dueForRecallExamDate).format('MMM Do, YYYY') : 'n/a'}
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
};

PatientRecalls.defaultProps = {
  recalls: [],
};
