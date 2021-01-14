
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TimeOffListItem from './TimeOffListItem';
import { List } from '../../../../library';
import { sortByFieldAsc } from '../../../../library/util/SortEntities';
import styles from './styles.scss';
import { practitionerShape } from '../../../../library/PropTypeShapes';

class TimeOffList extends Component {
  constructor(props) {
    super(props);
    this.deleteTimeOff = this.deleteTimeOff.bind(this);
  }

  deleteTimeOff(timeOff) {
    const { deleteTimeOff } = this.props;
    const deleteTf = window.confirm('Are you sure you want to the delete time off ?');

    if (deleteTf) {
      deleteTimeOff(timeOff);
    }
  }

  render() {
    const { timeOffs, practitioner, onSelectTimeOff, children, timezone } = this.props;

    return (
      <List className={styles.timeOffList} data-test-id="timeOffList">
        <div className={styles.timeOffList_addTimeOffText}>Add Time Off{children}</div>
        {sortByFieldAsc(timeOffs, 'startDate')
          .toArray()
          .map(timeOff => (
            <TimeOffListItem
              key={timeOff.get('id')}
              timeOff={timeOff}
              practitioner={practitioner}
              onClick={() => onSelectTimeOff(timeOff)}
              deleteTimeOff={this.deleteTimeOff}
              timezone={timezone}
            />
          ))}
      </List>
    );
  }
}

TimeOffList.propTypes = {
  timeOffs: PropTypes.shape({}).isRequired,
  practitioner: PropTypes.shape(practitionerShape).isRequired,
  onSelectTimeOff: PropTypes.func.isRequired,
  deleteTimeOff: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]).isRequired,
};

export default TimeOffList;
