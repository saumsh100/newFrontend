
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import orderBy from 'lodash/orderBy';
import { List, ListItem, Avatar, getFormattedDate } from '../../../../library';
import { patientShape } from '../../../../library/PropTypeShapes';
import styles from './styles.scss';
import styles2 from '../styles.scss';
import PatientPopover from '../../../../library/PatientPopover';

const contactMethodHash = {
  email: 'Email',
  sms: 'SMS',
  'sms/email': 'Email & SMS',
  smart_follow_up: 'Smart Follow Up',
};

export default function PatientRecalls({ recalls, timezone }) {
  return (
    <List className={styles.list}>
      {orderBy(recalls, 'sendDate').map(({ patient, primaryTypes, recall, sendDate }) => {
        const hashedTypes = primaryTypes.map(e => contactMethodHash[e]);
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
            <div className={styles2.mediumCol}>
              <span>
                <div>{type}</div>
                <div className={classnames(styles.muted, styles.lowercase)}>
                  {`${hashedTypes.join(' & ')}`}
                </div>
              </span>
            </div>
            <div className={styles2.col}>
              {dueForHygieneDate
                ? getFormattedDate(dueForHygieneDate, 'MMM Do, YYYY', timezone)
                : 'n/a'}
            </div>
            <div className={styles2.col}>
              {dueForRecallExamDate
                ? getFormattedDate(dueForRecallExamDate, 'MMM Do, YYYY', timezone)
                : 'n/a'}
            </div>
          </ListItem>
        );
      })}
    </List>
  );
}

PatientRecalls.propTypes = {
  recalls: PropTypes.arrayOf(
    PropTypes.shape({
      patient: PropTypes.shape(patientShape),
      primaryTypes: PropTypes.arrayOf(PropTypes.string),
      recall: PropTypes.shape(),
      sendDate: PropTypes.string,
    }),
  ),
  timezone: PropTypes.string.isRequired,
};

PatientRecalls.defaultProps = {
  recalls: [],
};
