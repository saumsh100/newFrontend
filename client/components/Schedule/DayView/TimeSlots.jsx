
import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';

class TimeSlots extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      practitioner,
      slotData,
      timeSlotHeight,
      column,
    } = this.props;

    let showSlot = (
      <div className={styles.dayView_body_timeSlot} style={timeSlotHeight}>
        {''}
      </div>
    );
    if (slotData.filled && practitioner !== '') {

      const apps = slotData.appointments;
      const filteredApps = apps.filter((app) => {
         return app.practitionerId === practitioner.toJS().id;
      });

      console.log(column, slotData.position, filteredApps);
      showSlot = (
        <div className={styles.dayView_body_timeSlot} style={timeSlotHeight}>
          slot Position: {slotData.position}
          column: {column}
          {practitioner.toJS().id}
        </div>
      );
    }

    return (
      <div>
      {showSlot}
      </div>
    );
  }
}

export default TimeSlots;
