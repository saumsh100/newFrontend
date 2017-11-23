import React, { PropTypes } from 'react';
import { ListItem, List } from '../../../../library'

import styles from './styles.scss';

const actionsList = [
  'Send SMS Reminder',
  'Send Email Reminder',
  'No Preference',
  'Send SMS Recare',
  'Send Email Recare',
  'Send Phone Recare',
  'Send SMS',
  'Send Email',
];

export default function Actions(props) {
  const {
    patientIds,
  } = props;

  return (
    <List className={styles.actionsContainer}>
      {actionsList.map((action, index) => {
        return (
          <ListItem key={`patientIds_${index}`} className={styles.actionItem} onClick={() =>{} } disabled>
            {action}
          </ListItem>
        );
      })}
    </List>
  );
}

Actions.propTypes = {
  patientIds: PropTypes.arrayOf(String),
};
