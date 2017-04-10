
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { ListItem, IconButton } from '../../../../library';
import styles from './styles.scss';

class TimeOffListItem extends Component {
  constructor(props) {
    super(props);
    this.deleteTimeOff = this.deleteTimeOff.bind(this);
  }

  deleteTimeOff() {
    const { timeOff, deleteTimeOff, } = this.props;

    let deleteTf = confirm('Delete Time Off ?');

    if (deleteTf) {
      deleteTimeOff(timeOff);
    }
  }

  render() {
    const { timeOff, onClick, } = this.props;

    const {
      startDate,
      endDate,

    } = timeOff;

    return (
      <div className={styles.timeOffList}>
        <ListItem style={{width: '100%' }}onClick={onClick}>
          From:
          {moment(startDate).format('L')}
          To:
          {moment(endDate).format('L')}
        </ListItem>
        <IconButton
          icon="trash"
          className={styles.timeOffList_delete}
          onClick={this.deleteTimeOff}
        />
      </div>
    );
  }
}

TimeOffListItem.propTypes = {
  timeOff: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  deleteTimeOff: PropTypes.func.isRequired,
};

export default TimeOffListItem;
