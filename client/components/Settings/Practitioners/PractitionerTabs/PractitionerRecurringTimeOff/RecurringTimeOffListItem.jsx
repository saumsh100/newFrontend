
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { ListItem, Icon, IconButton, Col } from '../../../../library';
import styles from './styles.scss';

const setTime = (time) => {
  const tempTime = new Date(time);
  const mergeTime = new Date(1970, 1, 0);
  mergeTime.setHours(tempTime.getHours());
  return mergeTime.toISOString();
};

class RecurringTimeOffListItem extends Component {
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
      startTime,
      endTime,
      note,
      interval,
      fromPMS,
      dayOfWeek,
      allDay,
      pmsId,
    } = timeOff;

    const startDateFM = moment(startDate).format('MMM Do YYYY');
    const endDateFM = moment(endDate).format('MMM Do YYYY');
    const startTimeFM = moment(startTime).format('hh:mm A');
    const endTimeFM = moment(endTime).format('hh:mm A');

    let showData = allDay
      ? `${startDateFM} To: ${endDateFM}`
      : `${startDateFM} To: ${endDateFM} - ${startTimeFM} To: ${endTimeFM}`;

    showData += ` - Every: ${dayOfWeek} - Interval: ${interval}`;

    const showNote = note ? `${note}` : 'No Description';

    const button =
      fromPMS || pmsId ? (
        <div className={styles.timeOffList_readOnly}>Read Only</div>
      ) : (
        <IconButton
          icon="trash"
          className={styles.timeOffList_delete}
          onClick={this.deleteTimeOff}
        />
      );

    return (
      <ListItem
        onClick={fromPMS || pmsId ? () => {} : onClick}
        className={styles.timeOffList_item}
      >
        <div className={styles.timeOffList_date}>
          {showData}
          <div className={styles.timeOffList_note}>{showNote}</div>
        </div>
        <div className={styles.timeOffList_allDay}>
          {allDay ? 'All Day' : null}
        </div>
        {button}
      </ListItem>
    );
  }
}

RecurringTimeOffListItem.propTypes = {
  timeOff: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  deleteTimeOff: PropTypes.func.isRequired,
};

export default RecurringTimeOffListItem;
