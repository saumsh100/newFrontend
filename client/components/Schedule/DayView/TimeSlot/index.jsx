
import React, { Component, PropTypes } from 'react';

import styles from '../styles.scss';

class TimeSlot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      practitionersArray,
      timeSlots,
      timeSlotHeight,
    } = this.props;



    // TODO: get rid of Grid, Row, Col
    // TODO: separate column, timeslot grid rendering from appointment rendering
    // TODO: appointment rendering should be based on a percentage top left not hardcoded px value
    // TODO: (16 - startTime) / totalHours * 100 (4:00pm)
    // TODO:

    return (
      <div style={{ position: 'relative', display: 'flex', width: '100%' }}>
        {practitionersArray.map((pract, i, arr)=> {
          return (
            <div key={i} style={{ width: `${100 / (arr.length)}%` }}>
              {timeSlots.map((slot, index) => {
                return (
                  <div key={index} className={styles.dayView_body_timeSlot} style={timeSlotHeight}>
                    {''}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default TimeSlot;
