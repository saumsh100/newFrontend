
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { ListItem, IconButton } from '../../../../library';
import styles from './styles.scss';

class TimeOffListItem extends Component {
  constructor(props) {
    super(props);
    this.deleteTimeOff = this.deleteTimeOff.bind(this);
  }

  deleteTimeOff(e) {
    e.stopPropagation();
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
      <ListItem className={styles.timeOffList} onClick={onClick}>
        From:
        {moment(startDate).format('L')}
        To:
        {moment(endDate).format('L')}
        <IconButton
          icon="trash"
          className={styles.timeOffList_delete}
          onClick={this.deleteTimeOff}
        />
      </ListItem>
    );
  }
}

TimeOffListItem.propTypes = {
  timeOff: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  deleteTimeOff: PropTypes.func.isRequired,
};

export default TimeOffListItem;
