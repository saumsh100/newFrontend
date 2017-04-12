
import React, { Component, PropTypes } from 'react';
import TimeOffListItem from './TimeOffListItem';
import { List } from '../../../../library';
import styles from './styles.scss';

class TimeOffList extends Component {
  constructor(props) {
    super(props);
    this.deleteTimeOff = this.deleteTimeOff.bind(this);
  }

  deleteTimeOff(timeOff) {
    const { deleteTimeOff } = this.props;
    const deleteTf = confirm('Delete Time Off ?');

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
      <List className={styles.timeOffList} >
        <div className={styles.timeOffList_addTimeOffText}>Add Time Off: {children}</div>
        {timeOffs.toArray().map((timeOff) => {
          return (
            <TimeOffListItem
              key={timeOff.get('id')}
              timeOff={timeOff}
              practitioner={practitioner}
              onClick={() => onSelectTimeOff(timeOff)}
              deleteTimeOff={this.deleteTimeOff}
            />
          );
        })}
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

export default TimeOffList
