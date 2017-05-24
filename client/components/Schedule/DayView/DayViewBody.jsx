
import React, { Component, PropTypes } from 'react';
import TimeColumn from './TimeColumn/TimeColumn';
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
      schedule,
      practitioners,
      patients,
      appointments,
      services,
      chairs,
      selectAppointment,
    } = this.props;

    const timeSlots = [];
    for (let i = startHour; i <= endHour; i += 1) {
      timeSlots.push({ position: i });
    }

    const timeSlotHeight = {
      height: `${100 / (endHour - startHour)}% `
    };

    let practitionersArray = practitioners;
    const checkedPractitioners = schedule.toJS().practitionersFilter;

    if (checkedPractitioners.length) {
      practitionersArray = practitionersArray.toArray().filter((pr) => {
        return checkedPractitioners.indexOf(pr.id) > -1;
      });
    }

    return (
      <div className={styles.dayView_body}>
        <TimeColumn
          timeSlots={timeSlots}
          timeSlotHeight={timeSlotHeight}
        />
        <TimeSlot
          timeSlots={timeSlots}
          timeSlotHeight={timeSlotHeight}
          practitionersArray={practitionersArray}
          startHour={startHour}
          endHour={endHour}
          patients={patients}
          appointments={appointments}
          services={services}
          chairs={chairs}
          selectAppointment={selectAppointment}
        />
      </div>
    );
  }
}

export default DayViewBody;
