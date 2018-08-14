
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../PatientInfo/LeftInfoDisplay/styles.scss';
import { Icon, DropdownMenu, List, ListItem } from '../../library/index';

export default function ReminderDropDowns(props) {
  const reminderSmsMenu = props => (
    <div {...props}>
      <div className={styles.iconContainer}>
        <Icon icon="comment" size={1.2} type="solid" />
        <span className={styles.iconContainer_caret}>
          <Icon icon="caret-down" size={1.2} type="solid" />
        </span>
      </div>
    </div>
  );

  const reminderEmailMenu = props => (
    <div {...props}>
      <div className={styles.iconContainer}>
        <Icon icon="envelope" size={1.2} type="solid" />
        <span className={styles.iconContainer_caret}>
          <Icon icon="caret-down" size={1.2} type="solid" />
        </span>
      </div>
    </div>
  );

  const reminderPhoneMenu = props => (
    <div {...props}>
      <div className={styles.iconContainer}>
        <Icon icon="phone" size={1.2} type="solid" />
        <span className={styles.iconContainer_caret}>
          <Icon icon="caret-down" size={1.2} type="solid" />
        </span>
      </div>
    </div>
  );

  return (
    <div className={styles.recallContainer}>
      <DropdownMenu labelComponent={reminderEmailMenu} align="left">
        <List className={styles.ddList}>
          <ListItem className={styles.ddListItem} disabled>
            Send a Custom Email Reminder
          </ListItem>
          <ListItem className={styles.ddListItem} disabled>
            Send a Automated Email Reminder
          </ListItem>
          <ListItem className={styles.ddListItem} disabled>
            Log Email
          </ListItem>
        </List>
      </DropdownMenu>
      <DropdownMenu labelComponent={reminderSmsMenu} align="left">
        <List className={styles.ddList}>
          <ListItem className={styles.ddListItem} disabled>
            Send a Custom SMS Reminder
          </ListItem>
          <ListItem className={styles.ddListItem} disabled>
            Send a Automated SMS Reminder
          </ListItem>
          <ListItem className={styles.ddListItem} disabled>
            Log SMS
          </ListItem>
        </List>
      </DropdownMenu>
      <DropdownMenu labelComponent={reminderPhoneMenu} align="left">
        <List className={styles.ddList}>
          <ListItem className={styles.ddListItem} disabled>
            Send a Custom Phone Reminder
          </ListItem>
          <ListItem className={styles.ddListItem} disabled>
            Send a Automated Phone Reminder
          </ListItem>
          <ListItem className={styles.ddListItem} disabled>
            Log Phone
          </ListItem>
        </List>
      </DropdownMenu>
    </div>
  );
}
