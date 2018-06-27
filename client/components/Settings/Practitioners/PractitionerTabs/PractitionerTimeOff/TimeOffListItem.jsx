
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
      startDate, endDate, note, allDay, fromPMS, pmsId,
    } = timeOff;

    const startDateFM = moment(startDate).format('MMM Do YYYY');
    const endDateFM = moment(endDate).format('MMM Do YYYY');
    const startTimeFM = moment(startDate).format('LT');
    const endTimeFM = moment(endDate).format('LT');

    const showData = allDay
      ? `${startDateFM} To: ${endDateFM}`
      : `${startDateFM} ${startTimeFM} To: ${endDateFM} ${endTimeFM}`;

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
          {allDay ? 'All Day' : null}&nbsp;
        </div>
        {button}
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
