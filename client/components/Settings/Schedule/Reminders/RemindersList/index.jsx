import React, { PropTypes, Component } from 'react';
import { ListItem, Button } from '../../../../library';
import styles from '../styles.scss';


class RemindersList extends Component {

  render() {
    const { primaryType, length, edit, deleteFunc } = this.props;

    const button = <Button className={styles.edit} onClick={edit}>Edit</Button>;
    const buttonDel = <Button className={styles.edit} onClick={deleteFunc}>Delete</Button>;

    return (
      <ListItem
        className={styles.listItem}
      >
        <div className={styles.main}>
          <div className={styles.userName}>
            <p className={styles.list}>Type: {primaryType.toUpperCase()}</p>
            <p className={styles.list}>{length / 60 / 60 } hours before appointment</p>
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
