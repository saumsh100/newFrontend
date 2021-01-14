
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RecurringTimeOffListItem from './RecurringTimeOffListItem';
import { List } from '../../../../library';
import styles from './styles.scss';
import { practitionerShape } from '../../../../library/PropTypeShapes';

class RecurringTimeOffList extends Component {
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
    const { recurringTimeOffs, practitioner, onSelectTimeOff, children, timezone } = this.props;

    return (
      <List className={styles.timeOffList} data-test-id="timeOffList">
        <div className={styles.timeOffList_addTimeOffText}>Add Time Off{children}</div>
        {recurringTimeOffs.toArray().map(timeOff => (
          <RecurringTimeOffListItem
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

RecurringTimeOffList.propTypes = {
  practitioner: PropTypes.shape(practitionerShape),
  onSelectTimeOff: PropTypes.func.isRequired,
  deleteTimeOff: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  recurringTimeOffs: PropTypes.instanceOf(Map),
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]).isRequired,
};

RecurringTimeOffList.defaultProps = {
  recurringTimeOffs: null,
  practitioner: null,
};

export default RecurringTimeOffList;
