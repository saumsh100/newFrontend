
import React, { Component, PropTypes } from 'react';
import TimeColumn from './TimeColumn';
import TimeSlot from './TimeSlot/index';
import styles from './styles.scss';

class DayViewBody extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      startHour,
      endHour,
    } = this.props;

    const timeSlots = [];
    for (let i = startHour; i <= endHour; i += 1) {
      timeSlots.push({ position: i });
    }

    const scale = 2;
    const rowHeight = 60;
    const timeSlotHeight = {
      height: `${scale * rowHeight}px`,
    };

    return (
      <div className={styles.dayView_body}>
        <TimeColumn
          timeSlots={timeSlots}
          timeSlotHeight={timeSlotHeight}
        />
        <TimeSlot
          timeSlots={timeSlots}
          timeSlotHeight={timeSlotHeight}
          scale={scale}
          {...this.props}
        />
      </div>
    );
  }
}

export default DayViewBody;
