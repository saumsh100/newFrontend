import React, { PropTypes, Component } from 'react';
import { Avatar, ListItem, Button } from '../../../../library';
import styles from '../styles.scss';


class ActiveUsersList extends Component {

  render() {
    const { activeUser, role, currentUserId, userId, currentUserRole, edit } = this.props;
    const badge = (userId === currentUserId ? <span className={styles.badge}>You</span> : null);
    let button = null;
    if ((currentUserRole === 'SUPERADMIN' || currentUserRole === 'ADMIN'  || currentUserRole === 'OWNER' || role === 'SUPERADMIN')
      && role !== 'SUPERADMIN' && !(currentUserRole === 'ADMIN' && role === 'ADMIN') && currentUserRole !== 'MANAGER' && !(currentUserRole === 'OWNER' && role === 'ADMIN')) {
      button = (userId !== currentUserId ? <Button className={styles.edit} onClick={edit}>Edit</Button> : null);
    }

    return (
      <ListItem className={styles.userListItem}>
        <div className={styles.main}>
          <Avatar className={styles.image} user={activeUser} />
          <div className={styles.userName}>
            <div>
              <p className={styles.name}>{activeUser.getName()} {badge}</p>
            </div>
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
