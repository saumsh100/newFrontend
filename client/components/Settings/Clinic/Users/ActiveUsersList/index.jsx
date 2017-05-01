import React, { PropTypes, Component } from 'react';
import { Avatar, ListItem, Button } from '../../../../library';
import styles from '../styles.scss';


class ActiveUsersList extends Component {

  render() {
    const { activeUser, role } = this.props;
    return (
      <ListItem className={styles.userListItem}>
        <div className={styles.main}>
          <Avatar className={styles.image} url="https://placeimg.com/640/480/people" />
          <div className={styles.userName}>
            <p className={styles.name}>{activeUser.getName()}</p>
            <p className={styles.email}>{activeUser.getUsername()} - {role}</p>
          </div>
        </div>
        <Button className={styles.edit}>Edit</Button>
      </ListItem>
    );
  }
}


export default ActiveUsersList;
