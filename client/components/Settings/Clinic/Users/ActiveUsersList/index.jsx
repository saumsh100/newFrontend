import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Avatar, ListItem, Button } from '../../../../library';
import { deleteEntityRequest } from '../../../../../thunks/fetchEntities';
import styles from '../styles.scss';


class ActiveUsersList extends Component {
  constructor(props) {
    super(props);

    this.deleteUser = this.deleteUser.bind(this);
  }

  deleteUser(id, name) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      this.props.deleteEntityRequest({ key: 'users', id });
    }
  }

  render() {
    const { activeUser, role, currentUserId, userId, currentUserRole, edit } = this.props;
    const badge = (userId === currentUserId ? <span className={styles.badge}>You</span> : null);
    let button = null;
    if ((currentUserRole === 'SUPERADMIN' || currentUserRole === 'OWNER') && role !== 'SUPERADMIN') {
      button = (userId !== currentUserId ? <div className={styles.paddingRight}>
        <Button className={styles.edit} onClick={edit} icon="edit" tertiary>Edit</Button></div> : null);
    }

    const check = (currentUserRole === 'SUPERADMIN' || currentUserRole === 'OWNER') && (role !== 'SUPERADMIN' && role !== 'OWNER');

    const deleteMe = check ? <Button className={styles.delete} icon="trash" onClick={() => this.deleteUser(activeUser.id, activeUser.firstName)}>Delete</Button> : null;

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
        {deleteMe}
        {button}
      </ListItem>
    );
  }
}

ActiveUsersList.propTypes = {
  activeUser: PropTypes.object,
  role: PropTypes.string,
  currentUserId: PropTypes.string,
  userId: PropTypes.string,
  currentUserRole: PropTypes.string,
  edit: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(ActiveUsersList);
