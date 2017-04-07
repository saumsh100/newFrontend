
import React, { Component, PropTypes } from 'react';
import TimeOffListItem from './TimeOffListItem';
import { List, IconButton } from '../../../../library';

class TimeOffList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      timeOffs,
      practitioner,
      onSelectTimeOff,
      deleteTimeOff,
    } = this.props;

    return (
      <List>
        {timeOffs.toArray().map((timeOff) => {
          return (
            <div style={{ display: 'flex' }}>
              <TimeOffListItem
                key={timeOff.get('id')}
                timeOff={timeOff}
                practitioner={practitioner}
                onClick={() => onSelectTimeOff(timeOff)}
              />
              <IconButton
                icon="trash"
                style={{ marginLeft: 'auto', backgroundColor: 'white' }}
                onClick={() => deleteTimeOff(timeOff)}
              />
            </div>
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
};

export default TimeOffList
