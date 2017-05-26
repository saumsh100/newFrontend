
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

