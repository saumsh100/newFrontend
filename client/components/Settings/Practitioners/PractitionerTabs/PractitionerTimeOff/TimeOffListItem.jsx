
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { ListItem, Icon, IconButton } from '../../../../library';
import styles from './styles.scss';

class TimeOffListItem extends Component {
  constructor(props) {
    super(props);
    this.deleteTimeOff = this.deleteTimeOff.bind(this);
  }

  deleteTimeOff(e) {
    e.stopPropagation();
    const { timeOff, deleteTimeOff } = this.props;
    deleteTimeOff(timeOff);
  }

  render() {
    const { timeOff, onClick } = this.props;

    const {
      startDate,
      endDate,
      note,
    } = timeOff;

    const showNote = note ? ` Note: ${note}` : null;

    return (
      <ListItem onClick={onClick} className={styles.timeOffList_item}>
        {moment(startDate).format('MMM Do YYYY')} To: {moment(endDate).format('MMM Do YYYY')}
        {showNote}
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
