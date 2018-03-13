import React, { PropTypes } from 'react';
import TimeSlotColumn from './TimeSlotColumn';
import ShowAppointment from './ShowAppointment';
import ShowMark from './ShowMark';
import styles from '../styles.scss';
import {
  calculateAppoitmentTop,
  intersectingAppointments,
  sortAppsByStartDate,
  buildAppoitmentProps } from './helpers';

/**
 * Function to calculate the intersection of appointments,
 * build the props and set the correct component to render
 * @param {*} params
 */
const renderDisplayComponent = params => (app, index, array) => {
  const {
    timeSlotHeight,
    startHour,
    endHour,
    selectAppointment,
    selectedAppointment,
    minWidth,
    numOfColumns,
    columnIndex,
    scheduleView,
    unit,
  } = params;

  const intersectingApps = intersectingAppointments(
    array,
    app.startDate,
    app.endDate
  );
  
  const rowSort = intersectingApps.sort(sortAppsByStartDate);

  const appoitmentParams = {
    appointment: app,
    rowSort,
    startHour,
    timeSlotHeight,
    unit,
    columnIndex,
    numOfColumns,
    minWidth,
  };

  const appoitmentProps = app.mark
    ? {}
    : buildAppoitmentProps(appoitmentParams);

  return app.mark ? (
    <ShowMark
      key={index}
      appointment={app}
      startHour={startHour}
      endHour={endHour}
      rowSort={rowSort}
      timeSlotHeight={timeSlotHeight}
      {...appoitmentProps}
    />
  ) : (
    <ShowAppointment
      key={index}
      selectAppointment={selectAppointment}
      selectedAppointment={selectedAppointment}
      scheduleView={scheduleView}
      appointment={app}
      {...appoitmentProps}
    />
  );
};

export default function TimeSlot(props) {
  const {
    timeSlots,
    timeSlotHeight,
    filteredApps,
    minWidth,
    startHour,
    unit,
  } = props;

  const timeSlotContentStyle = {
    minWidth: `${minWidth}px`,
  };

  return (<div style={timeSlotContentStyle} className={styles.timeSlotColumn}>
    <TimeSlotColumn timeSlots={timeSlots} timeSlotHeight={timeSlotHeight} />

    {filteredApps && filteredApps.sort(sortAppsByStartDate)
          .map(calculateAppoitmentTop({ startHour, timeSlotHeight, unit }))
          .map(renderDisplayComponent(props))}
  </div>);
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
  scheduleView: PropTypes.string,
  selectAppointment: PropTypes.func.isRequired,
  selectedAppointment: PropTypes.object,
  filteredApps: PropTypes.arrayOf(PropTypes.object),
  numOfColumns: PropTypes.number,
  columnIndex: PropTypes.number,
  unit: PropTypes.number,
};

