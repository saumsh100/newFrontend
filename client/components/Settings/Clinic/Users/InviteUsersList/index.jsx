import React, {PropTypes, Component} from 'react';
import {ListItem, Button } from '../../../../library';


class InviteUsersList extends Component {

  render() {
    const { email, date, onDelete, mainStyle, nameStyle, emailStyle, userListStyle, editStyles, currentUserRole } = this.props;
    const button = ((currentUserRole !== 'MANAGER') ? <Button onClick={onDelete} className={editStyles}>Cancel Invitation</Button> : null);
    const localDate = new Date(date);

    return (
      <ListItem className={userListStyle}>
        <div className={mainStyle}>
          <p className={nameStyle}>{email}</p>
          <p className={emailStyle}>
            Invited {localDate.toDateString()} {localDate.toLocaleTimeString()}</p>
        </div>
        {button}
      </ListItem>
    );
  }
}

InviteUsersList.PropTypes = {
  activeUser: PropTypes.object,
  date: PropTypes.instanceOf(Date),
  mainStyle: PropTypes.object,
  nameStyle: PropTypes.object,
  emailStyle: PropTypes.object,
  editStyles: PropTypes.object,
  userListStyle: PropTypes.object,
  email: PropTypes.string,
  currentUserRole: PropTypes.string,
  onDelete: PropTypes.func,
};

export default InviteUsersList;
