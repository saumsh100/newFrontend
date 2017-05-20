
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {Grid, Row, Col} from '../../library';
import TimeSlotColumn from './TimeSlotColumn';
import styles from './styles.scss';

class TimeSlot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      appointments,
      timeSlots,
      timeSlotHeight,
      currentDate,
      schedule,
      practitioners,
    } = this.props;

    let practitionersArray = practitioners;
    const checkedPractitioners = schedule.toJS().practitionersFilter;

    if (checkedPractitioners.length) {
      practitionersArray = practitionersArray.toArray().filter((pr) => {
        return checkedPractitioners.indexOf(pr.id) > -1;
      });
    }

    const practColumns = [];
    for (let i = 0; i <= 3; i += 1) {
      if(practitionersArray[i]){
        practColumns.push(practitionersArray[i]);
      } else {
        practColumns.push('');
      }
    }
    const slottedAppointments = timeSlots.map((slot) => {
      const appPositions = appointments.toArray().filter((app) => {
        const startDate = moment(app.startDate);
        const isSameDate = startDate.isSame(currentDate, 'day');
        const startHour = startDate.hour();
         if (slot.position === startHour && isSameDate) {
           slot.filled = true;
           return app;
         }
      });
      const newSlot = slot;
      newSlot.appointments = appPositions;
      return newSlot;
    });

    return (
      <Grid>
        <Row>
          {practColumns.map((column, index) => {
            return (
              <Col xs={3} >
                <TimeSlotColumn
                  key={index}
                  practitioner={column}
                  timeSlots={slottedAppointments}
                  timeSlotHeight={timeSlotHeight}
                  column={index}
                />
              </Col>
            );
          })}
        </Row>
      </Grid>
    );
  }
}

export default TimeSlot;
