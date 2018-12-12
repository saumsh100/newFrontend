
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { dateFormatter } from '@carecru/isomorphic';
import { ListItem, IconButton } from '../../../../library';
import styles from './styles.scss';
import PractitionerRecurringTimeOff from '../../../../../entities/models/PractitionerRecurringTimeOff';

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
    const { timeOff, onClick, timezone } = this.props;

    const { startDate, endDate, note, allDay, fromPMS, pmsId } = timeOff;

    const startDateFM = dateFormatter(startDate, timezone, 'MMM Do YYYY');
    const endDateFM = dateFormatter(endDate, timezone, 'MMM Do YYYY');
    const startTimeFM = dateFormatter(startDate, timezone, 'LT');
    const endTimeFM = dateFormatter(endDate, timezone, 'LT');

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
      <ListItem onClick={fromPMS || pmsId ? () => {} : onClick} className={styles.timeOffList_item}>
        <div className={styles.timeOffList_date}>
          {showData}
          <div className={styles.timeOffList_note}>{showNote}</div>
        </div>
        <div className={styles.timeOffList_allDay}>{allDay ? 'All Day' : null}&nbsp;</div>
        {button}
      </ListItem>
    );
  }
}

TimeOffListItem.propTypes = {
  timezone: PropTypes.string.isRequired,
  timeOff: PropTypes.instanceOf(PractitionerRecurringTimeOff).isRequired,
  onClick: PropTypes.func.isRequired,
  deleteTimeOff: PropTypes.func.isRequired,
};

export default TimeOffListItem;
