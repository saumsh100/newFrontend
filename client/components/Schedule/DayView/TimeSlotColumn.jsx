
import React, { Component, PropTypes } from 'react';
import TimeSlots from './TimeSlots';
import styles from './styles.scss';

class TimeSlotColumn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      practitioner,
      timeSlots,
      timeSlotHeight,
      column,
    } = this.props;

    return (
      <div>
        {timeSlots.map((slotData, index) => {
          return (
            <TimeSlots
              practitioner={practitioner}
              key={index}
              slotData={slotData}
              timeSlotHeight={timeSlotHeight}
              column={column}
            />
          );
        })}
      </div>
    );
  }
}

export default TimeSlotColumn;
