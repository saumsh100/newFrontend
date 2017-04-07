
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { ListItem, IconButton, Modal } from '../../../../library';

class TimeOffListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { timeOff, setFormState } = this.props;

    const {
      startDate,
      endDate,
    } = timeOff
    
    return (
      <div>
        <ListItem onClick={() => setFormState('edit', timeOff)}>
          From: {moment(startDate).format('L')} To: {moment(endDate).format('L')}
        </ListItem>
      </div>
    );
  }
}

TimeOffListItem.PropTypes = {
  deleteTimeOff: PropTypes.func,
  timeOff: PropTypes.object,
};

export default TimeOffListItem;
