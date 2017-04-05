import React, { Component, PropTypes } from 'react';
import { ListItem } from '../../../../library';

class TimeOffListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { timeOff } = this.props;

    return (
      <ListItem>
        {timeOff.startDate}
      </ListItem>
    );
  }
}

TimeOffListItem.PropTypes = {
  timeOff: PropTypes.props,
};

export default TimeOffListItem;
