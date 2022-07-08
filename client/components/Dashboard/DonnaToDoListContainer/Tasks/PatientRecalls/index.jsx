import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import orderBy from 'lodash/orderBy';
import { List, ListItem, Avatar, getFormattedDate } from '../../../../library';
import { patientShape } from '../../../../library/PropTypeShapes';
import styles from '../../../styles';
import PatientPopover from '../../../../library/PatientPopover';

const contactMethodHash = {
  email: 'Email',
  sms: 'SMS',
  'sms/email': 'Email & SMS',
  smart_follow_up: 'Smart Follow Up',
};

export default function PatientRecalls({ recalls, timezone }) {
  return (
    <List className={styles.patientRecalls_list}>
      {orderBy(recalls, 'sendDate').map(({ patient, primaryTypes, recall, sendDate }) => {
        const hashedTypes = primaryTypes.map((e) => contactMethodHash[e]);
        const { dueForHygieneDate, dueForRecallExamDate } = patient;
        let type = recall.interval;
        if (type[0] === '-') {
          type = `${type.slice(1, type.length)} After`;
        } else {
          type += ' Before';
        }

        return (
          <ListItem
            className={styles.patientRecalls_listItem}
            key={`donnaToDoRecalls_${patient.id}`}
          >
            <div className={styles.tasks_avatar}>
              <Avatar size="sm" user={patient} />
            </div>
            <div className={styles.tasks_col}>
              <span className={styles.patientRecalls_textBlocks}>
                <PatientPopover patient={patient}>
                  <div>{`${patient.firstName} ${patient.lastName}`}</div>
                </PatientPopover>
                <div
                  className={classnames(
                    styles.patientRecalls_muted,
                    styles.patientRecalls_lowercase,
                    styles.patientRecalls_atTime,
                  )}
                >
                  {`at ${getFormattedDate(sendDate, 'h:mm a', timezone)}`}
                </div>
              </span>
            </div>
            <div className={styles.tasks_mediumCol}>
              <span className={styles.patientRecalls_textBlocks}>
                <div className={styles.patientRecalls_fontWeightMedium}>{type}</div>
                <div
                  className={classnames(
                    styles.patientRecalls_muted,
                    styles.patientRecalls_lowercase,
                  )}
                >
                  {`${hashedTypes.join(' & ')}`}
                </div>
              </span>
            </div>
            <div className={classnames(styles.tasks_col, styles.patientRecalls_fontWeightMedium)}>
              {dueForHygieneDate
                ? getFormattedDate(dueForHygieneDate, 'MMM Do, YYYY', timezone)
                : 'n/a'}
            </div>
            <div className={classnames(styles.tasks_col, styles.patientRecalls_fontWeightMedium)}>
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
