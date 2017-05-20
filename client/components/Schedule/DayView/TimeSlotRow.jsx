
import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';

class TimeSlotItem extends Component {
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

    const apps = slotData.appointments;
    const filteredApps = apps.filter((app) => {
       return app.practitionerId === practitioner.toJS().id;
    });

    const test = filteredApps.map((filteredapp) => {
          return filteredapp.id
      }
    );

    return (
      <div className={styles.dayView_body_timeSlot} style={timeSlotHeight}>
        slot Position: {slotData.position}
        column: {column}
        test: {test[0]}
      </div>
    );
  }
}

export default TimeSlotItem;
