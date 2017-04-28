import React, {Proptypes, Component} from 'react';
import {ListItem, Button } from '../../../../library';


class InviteUsersList extends Component {

  render() {
    const { email, date, onDelete, mainStyle, nameStyle, emailStyle, userListStyle, editStyles } = this.props;
    const localDate = new Date(date);
    return (
      <ListItem className={userListStyle}>
        <div className={mainStyle}>
          <p className={nameStyle}>{email}</p>
          <p className={emailStyle}>
            Invited: {localDate.toDateString()} {localDate.toLocaleTimeString()}</p>
        </div>
        <Button onClick={onDelete} className={editStyles}>Cancel Invitation</Button>
      </ListItem>
    );
  }
}


export default InviteUsersList;
