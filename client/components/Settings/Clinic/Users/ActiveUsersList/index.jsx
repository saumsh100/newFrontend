import React, { PropTypes, Component } from 'react';
import { Avatar, ListItem, Button } from '../../../../library';
import styles from '../styles.scss';


class ActiveUsersList extends Component {

  render() {
    const { activeUser, role, currentUserId, userId, currentUserRole, edit } = this.props;
    const badge = (userId === currentUserId ? <span className={styles.badge}>You</span> : null);
    let button = null;
    if (currentUserRole === 'OWNER') {
      button = (userId !== currentUserId ? <Button className={styles.edit} onClick={edit}>Edit</Button> : null);
    }

    return (
      <ListItem className={styles.userListItem}>
        <div className={styles.main}>
          <Avatar className={styles.image} url="https://placeimg.com/640/480/people" />
          <div className={styles.userName}>
            <p className={styles.name}>{activeUser.getName()} {badge}</p>
            <p className={styles.email}>{activeUser.getUsername()} - {role}</p>
          </div>
        </div>
        {button}
      </ListItem>
    );
  }
}

ActiveUsersList.PropTypes = {
  activeUser: PropTypes.object,
  role: PropTypes.string,
  currentUserId: PropTypes.string,
  userId: PropTypes.string,
  currentUserRole: PropTypes.string,
  edit: PropTypes.func,
};

export default ActiveUsersList;
