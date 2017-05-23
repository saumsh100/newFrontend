
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {Grid, Row, Col} from '../../../library/index';
import TimeSlotBlock from "./TimeSlotBlock";
import styles from '../styles.scss';

class TimeSlot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      appointments,
      schedule,
      practitioners,
      timeSlots,
      timeSlotHeight,
      currentDate,
    } = this.props;

    let practitionersArray = practitioners;
    const checkedPractitioners = schedule.toJS().practitionersFilter;

    if (checkedPractitioners.length) {
      practitionersArray = practitionersArray.toArray().filter((pr) => {
        return checkedPractitioners.indexOf(pr.id) > -1;
      });
    }

    for (let i = practitionersArray.length; i <= 3; i += 1) {
      practitionersArray.push('');
    }

    const slottedAppointments = timeSlots.map((slot) => {
      const appData = appointments.toArray().filter((app) => {
        const startDate = moment(app.startDate);
        const isSameDate = startDate.isSame(currentDate, 'day');
        const startHour = startDate.hour();
         if (slot.position === startHour && isSameDate) {
           return app;
         }
      });
      slot.appointments = appData;
      return slot;
    });

    return (
      <Grid>
        <Row>
          {practitionersArray.map((practitioner, i) => {
            return (
              <Col key={i} xs={3} >
                {slottedAppointments.map((slotData, index) => {
                  if(slotData.appointments.length && practitioner !== '') {
                    return (
                      <TimeSlotBlock
                        practitioner={practitioner}
                        key={index}
                        slotData={slotData}
                        timeSlotHeight={timeSlotHeight}
                        {...this.props}
                      />
                    );
                  } else {
                    return (
                      <div key={index} className={styles.dayView_body_timeSlot} style={timeSlotHeight}>
                        {''}
                      </div>
                    );
                  }
                })}
              </Col>
            );
          })}
        </Row>
      </Grid>
    );
  }
}

export default TimeSlot;
