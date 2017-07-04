import React, { PropTypes, Component } from 'react';
import { ListItem, Button } from '../../../../library';
import styles from '../styles.scss';


class RecallsList extends Component {

  render() {
    const { primaryType, length, edit } = this.props;

    const button = <Button className={styles.edit} onClick={edit}>Edit</Button>;

    return (
      <ListItem
        className={styles.listItem}
      >
        <div className={styles.main}>
          <div className={styles.userName}>
            <p className={styles.list}>Type: {primaryType.toUpperCase()}</p>
            <p className={styles.list}>Every {length / 60 / 60 } hours</p>
          </div>
        </div>
        {button}
      </ListItem>
    );
  }
}

RecallsList.propTypes = {
  primaryType: PropTypes.string,
  length: PropTypes.number,
  edit: PropTypes.func,
};

export default RecallsList;
