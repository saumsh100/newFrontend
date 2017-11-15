import React, { PropTypes } from 'react';
import styles from '../styles.scss';
import { Icon, DropdownMenu, List, ListItem } from '../../../../library';

export default function ReminderDropDowns(props){

  const reminderSmsMenu = props => (
    <div {...props}>
      <div className={styles.iconContainer} >
        <Icon icon="envelope" size={1.2} />
        <span className={styles.iconContainer_caret}>
          <Icon icon="caret-down" size={1.2} />
        </span>
      </div>
    </div>
  );

  const reminderEmailMenu = props => (
    <div {...props}>
      <div className={styles.iconContainer} >
        <Icon icon="comment" size={1.2} />
        <span className={styles.iconContainer_caret}>
          <Icon icon="caret-down" size={1.2} />
        </span>
      </div>
    </div>
  );

  const reminderPhoneMenu = props => (
    <div {...props}>
      <div className={styles.iconContainer} >
        <Icon icon="phone" size={1.2} />
        <span className={styles.iconContainer_caret}>
          <Icon icon="caret-down" size={1.2} />
        </span>
      </div>
    </div>
  );

  return (
    <div className={styles.recallContainer}>
      <DropdownMenu
        labelComponent={reminderSmsMenu}
      >
        <List className={styles.ddList}>
          <ListItem className={styles.ddListItem}>
            Send a Custom SMS Reminder
          </ListItem>
          <ListItem className={styles.ddListItem}>
            Send a Automated SMS Reminder
          </ListItem>
          <ListItem className={styles.ddListItem}>
            Log SMS
          </ListItem>
        </List>
      </DropdownMenu>
      <DropdownMenu
        labelComponent={reminderEmailMenu}
      >
        <List className={styles.ddList}>
          <ListItem className={styles.ddListItem}>
            Send a Custom Email Reminder
          </ListItem>
          <ListItem className={styles.ddListItem}>
            Send a Automated Email Reminder
          </ListItem>
          <ListItem className={styles.ddListItem}>
            Log Email
          </ListItem>
        </List>
      </DropdownMenu>
      <DropdownMenu
        labelComponent={reminderPhoneMenu}
      >
        <List className={styles.ddList}>
          <ListItem className={styles.ddListItem}>
            Send a Custom Phone Reminder
          </ListItem>
          <ListItem className={styles.ddListItem}>
            Send a Automated Phone Reminder
          </ListItem>
          <ListItem className={styles.ddListItem}>
            Log Phone Reminder
          </ListItem>
        </List>
      </DropdownMenu>
    </div>
  );
}
