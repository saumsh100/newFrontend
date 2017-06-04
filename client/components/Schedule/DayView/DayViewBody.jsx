
import React, { Component, PropTypes } from 'react';
import TimeColumn from './TimeColumn/TimeColumn';
import TimeSlot from './TimeSlot/index';
import styles from './styles.scss';
import { SortByFirstName } from '../../library/util/SortEntities';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

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

  const sortedPractitioners = practitioners.toArray().sort(SortByFirstName);

  const colors = ['#FF715A', '#FFC45A', '#2CC4A7', '#8CBCD6',];
  const colorLen = colors.length;
  const colorArray = [];
  const reset = Math.ceil(( sortedPractitioners.length - colorLen) / colorLen);

  for(let j = 0 ; j <= reset; j++) {
    for(let i = 0; i < colorLen;  i++) {
      colorArray.push(colors[i])
    }
  }

  let practitionersArray = sortedPractitioners.map((prac, index) => {
    return Object.assign({}, prac.toJS(), {
      color: colorArray[index],
    });
  });

  const checkedPractitioners = schedule.toJS().practitionersFilter;
  practitionersArray = practitionersArray.filter((pr) => {
    return checkedPractitioners.indexOf(pr.id) > -1;
  });

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

DayViewBody.propTypes = {
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  appointments: PropTypes.arrayOf(PropTypes.object),
  patients: PropTypes.object,
  services: PropTypes.object,
  chairs: PropTypes.object,
  practitioners: PropTypes.object,
  schedule: PropTypes.object,
  selectAppointment: PropTypes.func.isRequired,
};

