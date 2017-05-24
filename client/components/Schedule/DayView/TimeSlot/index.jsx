
import React, { Component, PropTypes } from 'react';
import AppointmentList from './AppointmentList';
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
      startHour,
      endHour,
      patients,
      appointments,
      services,
      chairs,
      selectAppointment,
    } = this.props;

    // TODO: get rid of Grid, Row, Col
    // TODO: separate column, timeslot grid rendering from appointment rendering
    // TODO: appointment rendering should be based on a percentage top left not hardcoded px value
    // TODO: (16 - startTime) / totalHours * 100 (4:00pm)
    // TODO:

    const colorArray = [ '#FF715A', '#FFC45A', '#2CC4A7', '#8CBCD6' ];

    return (
      <div style={{ position: 'relative', display: 'flex', width: '100%' }}>
        {practitionersArray.map((pract, i, arr)=> {
          const columnWidth = 100 / arr.length;
          return (
            <div key={i} style={{ width: `${columnWidth}%` }}>
              {timeSlots.map((slot, index) => {
                return (
                  <div key={index} className={styles.dayView_body_timeSlot} style={timeSlotHeight}>
                    {''}
                  </div>
                );
              })}
              <AppointmentList
                key={i}
                practitioner={pract}
                columnWidth={columnWidth}
                practIndex={i}
                startHour={startHour}
                endHour={endHour}
                patients={patients}
                appointments={appointments}
                services={services}
                chairs={chairs}
                selectAppointment={selectAppointment}
                bgColor={colorArray[i]}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default TimeSlot;
