
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { dateFormatter } from '@carecru/isomorphic';
import orderBy from 'lodash/orderBy';
import { List, ListItem, Avatar } from '../../../../library';
import { patientShape } from '../../../../library/PropTypeShapes';
import styles from './styles.scss';
import styles2 from '../styles.scss';
import PatientPopover from '../../../../library/PatientPopover';

export default function PatientRecalls({ recalls, timezone }) {
  return (
    <List className={styles.list}>
      {orderBy(recalls, 'sendDate').map(({ patient, primaryTypes, recall, sendDate }) => {
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
                  {`at ${dateFormatter(sendDate, timezone, 'h:mm a')}`}
                </div>
              </span>
            </div>
            <div className={styles2.mediumCol}>
              <span>
                <div>{type}</div>
                <div className={classnames(styles.muted, styles.lowercase)}>
                  {`${primaryTypes.join(' & ')}`}
                </div>
              </span>
            </div>
            <div className={styles2.col}>
              {dueForHygieneDate
                ? dateFormatter(dueForHygieneDate, timezone, 'MMM Do, YYYY')
                : 'n/a'}
            </div>
            <div className={styles2.col}>
              {dueForRecallExamDate
                ? dateFormatter(dueForRecallExamDate, timezone, 'MMM Do, YYYY')
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
