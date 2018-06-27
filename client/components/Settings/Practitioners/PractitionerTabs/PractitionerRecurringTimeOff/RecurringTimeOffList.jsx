
import React, { Component, PropTypes } from 'react';
import RecurringTimeOffListItem from './RecurringTimeOffListItem';
import { List } from '../../../../library';
import styles from './styles.scss';

class RecurringTimeOffList extends Component {
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
      recurringTimeOffs,
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
        {recurringTimeOffs.toArray().map(timeOff => (
          <RecurringTimeOffListItem
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

RecurringTimeOffList.propTypes = {
  // TODO: use Immutable PropTypes
  timeOffs: PropTypes.object.isRequired,
  practitioner: PropTypes.object.isRequired,
  onSelectTimeOff: PropTypes.func.isRequired,
  deleteTimeOff: PropTypes.func.isRequired,
};

export default RecurringTimeOffList;
