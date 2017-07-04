import React, { PropTypes, Component } from 'react';
import { ListItem, Button } from '../../../../library';
import styles from '../styles.scss';


class RecallsList extends Component {

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
            <p className={styles.list}>Every {length / 60 / 60 / 24 / 30 } months</p>
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

RecallsList.propTypes = {
  primaryType: PropTypes.string,
  length: PropTypes.number,
  edit: PropTypes.func,
  deleteFunc: PropTypes.func,
};

export default RecallsList;
