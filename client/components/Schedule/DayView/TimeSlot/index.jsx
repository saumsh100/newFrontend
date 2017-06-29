
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import ShowAppointment from './ShowAppointment';
import TimeSlotColumn from './TimeSlotColumn';

function intersectingAppointments(appointments, startDate, endDate) {
  const sDate = moment(startDate);
  const eDate = moment(endDate);

  return appointments.filter((app) => {
    const appStartDate = moment(app.startDate);
    const appEndDate = moment(app.endDate);
    if (sDate.isSame(appStartDate) || sDate.isBetween(appStartDate, appEndDate) ||
      eDate.isSame(appEndDate) || eDate.isBetween(appStartDate, appEndDate)) {
      return app;
    };
  });
}

const sortAppsByStartDate = (a, b) => {
  const aMoment = moment(a.startDate);
  const bMoment = moment(b.startDate);
  if (aMoment.isBefore(bMoment)) return -1;
  if (aMoment.isAfter(bMoment)) return 1;
  return 0;
};

export default function TimeSlot(props) {
  const {
    timeSlots,
    timeSlotHeight,
    startHour,
    endHour,
    filteredApps,
    selectAppointment,
    columnWidth,
    practIndex,
  } = props;

  const timeSlotContentStyle = {
    width: `${columnWidth}%`,
    boxSizing: 'border-box',
  };

  return (
    <div style={timeSlotContentStyle}>
      <TimeSlotColumn
        key={`column_${practIndex}`}
        index={practIndex}
        timeSlots={timeSlots}
        timeSlotHeight={timeSlotHeight}
        columnWidth={columnWidth}
      />
      {filteredApps && filteredApps.map((app, index, array) => {
        const intersectingApps = intersectingAppointments(array, app.startDate, app.endDate);
        // check which appointments are in the same row
        const row = moment(app.startDate).hour();
        const rowFilter = intersectingApps.filter(interApp => moment(interApp.startDate).hour() === row);
        const rowSort = rowFilter.sort(sortAppsByStartDate);

        return (
          <ShowAppointment
            key={index}
            practIndex={practIndex}
            appointment={app}
            selectAppointment={selectAppointment}
            startHour={startHour}
            endHour={endHour}
            columnWidth={columnWidth}
            widthIntersect={rowFilter.length}
            rowSort={rowSort}
          />
        );
      })}
    </div>
  );
}

TimeSlot.propTypes = {
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  practIndex: PropTypes.number,
  columnWidth: PropTypes.number,
  appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
  schedule: PropTypes.object.isRequired,
  patients: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  chairs: PropTypes.object.isRequired,
  timeSlots: PropTypes.array,
  timeSlotHeight: PropTypes.object,
  practitioner: PropTypes.object.isRequired,
  selectAppointment: PropTypes.func.isRequired,
};

