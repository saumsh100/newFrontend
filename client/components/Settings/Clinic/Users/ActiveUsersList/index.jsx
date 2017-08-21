import React, { PropTypes, Component } from 'react';
import { Avatar, ListItem, Button } from '../../../../library';
import styles from '../styles.scss';


class ActiveUsersList extends Component {

  render() {
    const { activeUser, role, currentUserId, userId, currentUserRole, edit } = this.props;
    const badge = (userId === currentUserId ? <span className={styles.badge}>You</span> : null);
    let button = null;
    if ((currentUserRole === 'SUPERADMIN' || currentUserRole === 'OWNER')  && role !== 'SUPERADMIN') {
      button = (userId !== currentUserId ? <Button className={styles.edit} onClick={edit} edit>Edit</Button> : null);
    }

    return (
      <ListItem
        className={styles.userListItem}
        data-test-id={activeUser.getName()}
      >
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
