import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { ListItem, IconButton } from '../../../../library';

class TimeOffListItem extends Component {
  constructor(props) {
    super(props);
    this.deleteTimeOff = this.deleteTimeOff.bind(this);
  }

  deleteTimeOff() {
    const { timeOff } = this.props;
    this.props.deleteTimeOff({ key: 'timeOffs', id: timeOff.get('id') });
  }

  render() {
    const { timeOff } = this.props;

    return (
      <ListItem style={{display: 'flex'}}>
        From: {moment(timeOff.startDate).format('L')} To: {moment(timeOff.endDate).format('L')}
        <IconButton icon="trash" onClick={this.deleteTimeOff} />
      </ListItem>
    );
  }
}

TimeOffListItem.PropTypes = {
  deleteTimeOff: PropTypes.func,
  timeOff: PropTypes.object,
};

export default TimeOffListItem;
