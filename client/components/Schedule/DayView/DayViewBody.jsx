
import React, { Component, PropTypes } from 'react';
import TimeColumn from './TimeColumn/TimeColumn';
import TimeSlot from './TimeSlot/index';
import styles from './styles.scss';

export default function   DayViewBody(props){
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
  } = props;

  const timeSlots = [];
  for (let i = startHour; i <= endHour; i += 1) {
    timeSlots.push({ position: i });
  }

  const timeSlotHeight = {
    height: '100px',
  };

  const colorArray = ['#FF715A', '#FFC45A', '#2CC4A7', '#8CBCD6',];

  let practitionersArray = practitioners.toArray().map((prac, index) => {
    let defaultIndexColor = index;
    if (!colorArray[defaultIndexColor]) {
      defaultIndexColor = 0;
    }
    return Object.assign({}, prac.toJS(), {
      color: colorArray[defaultIndexColor],
    });
  });

  const checkedPractitioners = schedule.toJS().practitionersFilter;


  practitionersArray = practitionersArray.filter((pr) => {
    return checkedPractitioners.indexOf(pr.id) > -1;
  });
  

  console.log(practitionersArray.length)
  return (
    <div className={styles.dayView_body}>
      <TimeColumn
        timeSlots={timeSlots}
        timeSlotHeight={timeSlotHeight}
      />
      <div className={styles.dayView_body_timeSlot}>
        {practitionersArray.length && practitionersArray.map((pract, i, arr) => {
          const columnWidth = 100 / arr.length;
          return (
            <TimeSlot
              key={i}
              timeSlots={timeSlots}
              timeSlotHeight={timeSlotHeight}
              practitioner={pract}
              practIndex={i}
              columnWidth={columnWidth}
              startHour={startHour}
              endHour={endHour}
              schedule={schedule}
              patients={patients}
              appointments={appointments}
              services={services}
              chairs={chairs}
              selectAppointment={selectAppointment}
            />
          );
        })}
      </div>
    </div>
  );
}

DayViewBody.PropTypes = {
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  appointments: PropTypes.object,
  patients: PropTypes.object,
  services: PropTypes.object,
  chairs: PropTypes.object,
  practitioners: PropTypes.object,
  schedule: PropTypes.object,
  selectAppointment: PropTypes.func.isRequired,
};

