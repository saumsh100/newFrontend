
import React, { PropTypes } from 'react';
import moment from 'moment';
import ShowAppointment from './ShowAppointment';
import ShowMark from './ShowMark';
import styles from '../styles.scss';
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
    }
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
    selectedAppointment,
    minWidth,
    numOfColumns,
    columnIndex,
    scheduleView,
    unit,
  } = props;

  const timeSlotContentStyle = {
    minWidth: `${minWidth}px`,
  };

  return (
    <div style={timeSlotContentStyle} className={styles.timeSlotColumn} >
      <TimeSlotColumn
        timeSlots={timeSlots}
        timeSlotHeight={timeSlotHeight}
      />

      {filteredApps && filteredApps.map((app, index, array) => {
        const intersectingApps = intersectingAppointments(array, app.startDate, app.endDate);
        // check which appointments are in the same row
        const row = moment(app.startDate).hour();
        let rowFilter = intersectingApps.filter(interApp => moment(interApp.startDate).hour() === row);

        if (rowFilter.length === 1) {
          rowFilter = array.filter(countApp => moment(countApp.startDate).hour() === row);
        }

        const rowSort = rowFilter.sort(sortAppsByStartDate);

        const displayComponent = app.mark ? (
          <ShowMark
            key={index}
            appointment={app}
            startHour={startHour}
            endHour={endHour}
            rowSort={rowSort}
            timeSlotHeight={timeSlotHeight}
          />
        ) : (
          <ShowAppointment
            key={index}
            appointment={app}
            selectAppointment={selectAppointment}
            startHour={startHour}
            endHour={endHour}
            widthIntersect={rowFilter.length}
            rowSort={rowSort}
            timeSlotHeight={timeSlotHeight}
            selectedAppointment={selectedAppointment}
            numOfColumns={numOfColumns}
            columnIndex={columnIndex}
            minWidth={minWidth}
            scheduleView={scheduleView}
            unit={unit}
          />
        );

        return displayComponent;
      })}
    </div>
  );
}

TimeSlot.propTypes = {
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  minWidth: PropTypes.number,
  appointments: PropTypes.arrayOf(PropTypes.object),
  schedule: PropTypes.object,
  patients: PropTypes.object,
  services: PropTypes.object,
  chairs: PropTypes.object,
  timeSlots: PropTypes.array,
  timeSlotHeight: PropTypes.object,
  practitioner: PropTypes.object,
  selectAppointment: PropTypes.func.isRequired,
  selectedAppointment: PropTypes.object,
  filteredApps: PropTypes.arrayOf(PropTypes.object),
  numOfColumns: PropTypes.number,
  columnIndex: PropTypes.number,
  unit: PropTypes.number,
};

