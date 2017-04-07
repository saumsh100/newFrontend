
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { ListItem } from '../../../../library';

class TimeOffListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { timeOff, onClick } = this.props;

    const {
      startDate,
      endDate,
    } = timeOff;

    return (
      <ListItem style={{width: '100%' }}onClick={onClick}>
        From:
        {moment(startDate).format('L')}
        To:
        {moment(endDate).format('L')}
      </ListItem>
    );
  }
}

TimeOffListItem.propTypes = {
  timeOff: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TimeOffListItem;
