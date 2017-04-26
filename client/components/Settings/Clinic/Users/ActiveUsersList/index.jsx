import React, {Proptypes, Component} from 'react';
import { ListItem } from '../../../../library';
import styles from '../styles.scss';


class ActiveUsersList extends Component {

  render() {
    const { activeUser } = this.props;

    return (
      <ListItem className={styles.userListItem}>
        {activeUser.getUsername()}
      </ListItem>
    );
  }
}


export default ActiveUsersList;
