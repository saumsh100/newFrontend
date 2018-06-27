
import React, { Component, PropTypes } from 'react';
import TimeOffListItem from './TimeOffListItem';
import { List } from '../../../../library';
import { sortByFieldAsc } from '../../../../library/util/SortEntities';
import styles from './styles.scss';

class TimeOffList extends Component {
  constructor(props) {
    super(props);
    this.deleteTimeOff = this.deleteTimeOff.bind(this);
  }

  deleteTimeOff(timeOff) {
    const { deleteTimeOff } = this.props;
    const deleteTf = confirm('Are you sure you want to the delete time off ?');

    if (deleteTf) {
      deleteTimeOff(timeOff);
    }
  }

  render() {
    const {
      timeOffs,
      practitioner,
      onSelectTimeOff,
      deleteTimeOff,
      children,
    } = this.props;

    return (
      <List className={styles.timeOffList} data-test-id="timeOffList">
        <div className={styles.timeOffList_addTimeOffText}>
          Add Time Off{children}
        </div>
        {sortByFieldAsc(timeOffs, 'startDate')
          .toArray()
          .map(timeOff => (
            <TimeOffListItem
              key={timeOff.get('id')}
              timeOff={timeOff}
              practitioner={practitioner}
              onClick={() => onSelectTimeOff(timeOff)}
              deleteTimeOff={this.deleteTimeOff}
            />
          ))}
      </List>
    );
  }
}

TimeOffList.propTypes = {
  // TODO: use Immutable PropTypes
  timeOffs: PropTypes.object.isRequired,
  practitioner: PropTypes.object.isRequired,
  onSelectTimeOff: PropTypes.func.isRequired,
  deleteTimeOff: PropTypes.func.isRequired,
};

export default TimeOffList;
