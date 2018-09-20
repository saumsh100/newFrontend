
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import { ListItem, IconButton } from '../../../../library';
import { dateFormatter } from '../../../../../../iso/helpers/dateTimezone';
import styles from './styles.scss';

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
    const { timeOff, onClick, timezone } = this.props;

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
    const startTimeFM = dateFormatter(startTime, timezone, 'LT');
    const endTimeFM = dateFormatter(endTime, timezone, 'LT');

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
      <ListItem onClick={fromPMS || pmsId ? () => {} : onClick} className={styles.timeOffList_item}>
        <div className={styles.timeOffList_date}>
          {showData}
          <div className={styles.timeOffList_note}>{showNote}</div>
        </div>
        <div className={styles.timeOffList_allDay}>{allDay ? 'All Day' : null}</div>
        {button}
      </ListItem>
    );
  }
}

RecurringTimeOffListItem.propTypes = {
  timeOff: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  deleteTimeOff: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
};

export default RecurringTimeOffListItem;
