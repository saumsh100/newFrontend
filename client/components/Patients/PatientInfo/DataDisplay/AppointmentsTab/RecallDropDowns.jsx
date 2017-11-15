import React, { PropTypes } from 'react';
import styles from '../styles.scss';
import { Icon, DropdownMenu, List, ListItem } from '../../../../library';

export default function RecallDropDowns(props){

  const recallSmsMenu = props => (
    <div {...props}>
      <div className={styles.iconContainer} >
        <Icon icon="envelope" size={1.2} />
        <span className={styles.iconContainer_caret}>
          <Icon icon="caret-down" size={1.2} />
        </span>
      </div>
    </div>
  );

  const recallEmailMenu = props => (
    <div {...props}>
      <div className={styles.iconContainer} >
        <Icon icon="comment" size={1.2} />
        <span className={styles.iconContainer_caret}>
          <Icon icon="caret-down" size={1.2} />
        </span>
      </div>
    </div>
  );

  const recallPhoneMenu = props => (
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
        labelComponent={recallSmsMenu}
      >
        <List className={styles.ddList}>
          <ListItem className={styles.ddListItem}>
            Send a Custom SMS Recall
          </ListItem>
          <ListItem className={styles.ddListItem}>
            Send a Automated SMS Recall
          </ListItem>
          <ListItem className={styles.ddListItem}>
            Log SMS
          </ListItem>
        </List>
      </DropdownMenu>
      <DropdownMenu
        labelComponent={recallEmailMenu}
      >
        <List className={styles.ddList}>
          <ListItem className={styles.ddListItem}>
            Send a Custom Email Recall
          </ListItem>
          <ListItem className={styles.ddListItem}>
            Send a Automated Email Recall
          </ListItem>
          <ListItem className={styles.ddListItem}>
            Log Email
          </ListItem>
        </List>
      </DropdownMenu>
      <DropdownMenu
        labelComponent={recallPhoneMenu}
      >
        <List className={styles.ddList}>
          <ListItem className={styles.ddListItem}>
            Send a Custom Phone Recall
          </ListItem>
          <ListItem className={styles.ddListItem}>
            Send a Automated Phone Recall
          </ListItem>
          <ListItem className={styles.ddListItem}>
            Log SMS
          </ListItem>
        </List>
      </DropdownMenu>
    </div>
  );
}
