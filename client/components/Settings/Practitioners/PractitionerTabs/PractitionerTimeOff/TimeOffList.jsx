
import React, { Component, PropTypes } from 'react';
import TimeOffListItem from './TimeOffListItem';
import { List } from '../../../../library';

class TimeOffList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { timeOffs, practitioner, setFormState } = this.props;

    return (
      <List>
        {timeOffs.toArray().map((tf) => {
          return (
            <TimeOffListItem
              key={tf.get('id')}
              timeOff={tf}
              practitioner={practitioner}
              setFormState={setFormState}
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
