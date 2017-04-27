import React, {Proptypes, Component} from 'react';
import {ListItem, Button } from '../../../../library';
import styles from '../styles.scss';


class InviteUsersList extends Component {

  render() {
    const { email, date, onDelete } = this.props;
    const localDate = new Date(date);
    return (
      <ListItem className={styles.userListItem}>
        <div className={styles.main}>
          <p className={styles.name}>{email}</p>
          <p className={styles.email}>
            Invited: {localDate.toDateString()} {localDate.toLocaleTimeString()}</p>
        </div>
        <Button onClick={onDelete} className={styles.edit}>Cancel Invitation</Button>
      </ListItem>
    );
  }
}


export default InviteUsersList;
