import React, { Component, PropTypes } from 'react';
import TimeOffListItem from './TimeOffListItem';
import { List } from '../../../../library';

class TimeOffList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { timeOffs, deleteTimeOff } = this.props;

    return (
      <List>
        {timeOffs.toArray().map((tf, index) => {
          return (
            <TimeOffListItem
              key={tf.get('id')}
              timeOff={tf}
              deleteTimeOff={deleteTimeOff}
            />
          );
        })}
      </List>
    );
  }
}

TimeOffList.PropTypes = {
  timeOffs: PropTypes.props,
};

export default TimeOffList
