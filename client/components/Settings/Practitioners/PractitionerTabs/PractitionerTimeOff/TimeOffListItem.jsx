
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

Date.prototype.stdTimezoneOffset = function () {
  const jan = new Date(this.getFullYear(), 0, 1);
  const jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.dst = function () {
  return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

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
      allDay,
    } = timeOff;

    const startTime = setTime(startDate);
    const endTime = setTime(endDate);

    const today = new Date();
    const startDateFM = (today.dst() ? moment(startDate).subtract(1, 'hours').format('MMM Do YYYY') : moment(startDate).format('MMM Do YYYY'));
    const endDateFM = (today.dst() ? moment(endDate).subtract(1, 'hours').format('MMM Do YYYY') : moment(endDate).format('MMM Do YYYY'));
    const startTimeFM = (today.dst() ? moment(startDate).subtract(1, 'hours').format('LT') : moment(startDate).format('LT'));
    const endTimeFM = (today.dst() ? moment(endDate).subtract(1, 'hours').format('LT') : moment(endDate).format('LT'));

    const showData = allDay ? `${startDateFM} To: ${endDateFM}` :
      `${startDateFM} ${startTimeFM} To: ${endDateFM} ${endTimeFM}`;

    const showNote = note ? `${note}` : 'No Description';

    return (
      <ListItem onClick={onClick} className={styles.timeOffList_item}>
        <div className={styles.timeOffList_date}>
          {showData}
          <div className={styles.timeOffList_note}>
            {showNote}
          </div>
        </div>
        <div className={styles.timeOffList_allDay}>
          {allDay ? 'All Day' : null}
        </div>
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
