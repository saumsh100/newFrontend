import PropTypes from 'prop-types';
import React from 'react';
import TimeSlotColumn from './TimeSlotColumn';
import ShowAppointment from './ShowAppointment';
import ShowMark from './ShowMark';
import styles from '../reskin-styles.scss';
import {
  calculateAppointmentTop,
  intersectingAppointments,
  sortAppsByStartDate,
  buildAppointmentProps,
} from './helpers';

/**
 * Function to calculate the intersection of appointments,
 * build the props and set the correct component to render
 * @param {*} params
 */
const renderDisplayComponent = (params) => (item, index, array) => {
  const {
    timeSlotHeight,
    startHour,
    selectAppointment,
    selectedAppointment,
    minWidth,
    numOfColumns,
    columnIndex,
    scheduleView,
    unit,
    timezone,
    fontColor,
  } = params;

  const intersectingApps = intersectingAppointments(array, item.startDate, item.endDate, timezone);
  const rowSort = intersectingApps.sort(sortAppsByStartDate);
  const defaultApptParams = {
    appointment: item,
    rowSort,
    startHour,
    timeSlotHeight,
    unit,
    columnIndex,
    numOfColumns,
    minWidth,
    fontColor,
  };

  return item.mark || item.event ? (
    <ShowMark
      key={index}
      appointment={item}
      timeSlotHeight={timeSlotHeight}
      timezone={timezone}
      {...buildAppointmentProps({
        ...defaultApptParams,
        backgroundColor: '#EFEEF2',
        fontColor: '#564C70',
        iconColor: '#241158',
      })}
    />
  ) : (
    <ShowAppointment
      key={index}
      appointment={item}
      selectAppointment={selectAppointment}
      selectedAppointment={selectedAppointment}
      scheduleView={scheduleView}
      timezone={timezone}
      {...buildAppointmentProps(defaultApptParams)}
    />
  );
};

export default function TimeSlot(props) {
  const { timeSlots, timeSlotHeight, items, startHour, unit, entityId, timezone } = props;

  return (
    <div className={styles.timeSlotColumn}>
      <TimeSlotColumn prefixKey={entityId} timeSlots={timeSlots} />

      {items &&
        items
          .sort(sortAppsByStartDate)
          .map(
            calculateAppointmentTop({
              startHour,
              timeSlotHeight,
              unit,
              timezone,
            }),
          )
          .map(renderDisplayComponent(props))}
    </div>
  );
}

TimeSlot.propTypes = {
  startHour: PropTypes.number.isRequired,
  timeSlots: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.number,
    }),
  ).isRequired,
  timeSlotHeight: PropTypes.shape({
    height: PropTypes.number,
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  unit: PropTypes.number.isRequired,
  entityId: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
};
