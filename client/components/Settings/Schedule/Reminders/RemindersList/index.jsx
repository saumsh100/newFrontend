
import React, { PropTypes, Component } from 'react';
import { ListItem, Button, Icon } from '../../../../library';
import styles from '../styles.scss';


class RemindersList extends Component {

  render() {
    const { primaryType, length, edit, deleteFunc } = this.props;

    let icon = primaryType.toLowerCase();

    if (icon === 'sms') {
      icon = 'comment';
    } else if (icon === 'email') {
      icon = 'envelope';
    }

    const button = <Button className={styles.edit} onClick={edit} edit>Edit</Button>;
    const buttonDel = <Button className={styles.edit} onClick={deleteFunc} edit>Delete</Button>;

    return (
      <ListItem
        className={styles.listItem}
      >
        <div className={styles.main}>
          <div className={styles.userName}>
            <p className={styles.list}><Icon icon={icon} /> <b>{primaryType.toUpperCase()}</b> </p>
            <p className={styles.list}>Every {length / 60 / 60 } hours</p>
          </div>
        </div>
        <div>
          {buttonDel}
          {button}
        </div>
      </ListItem>
    );
  }
}

RemindersList.propTypes = {
  primaryType: PropTypes.string,
  length: PropTypes.number,
  edit: PropTypes.func,
  deleteFunc: PropTypes.func,
};

export default RemindersList;
