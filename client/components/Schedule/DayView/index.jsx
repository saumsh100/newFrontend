
import PropTypes from 'prop-types';
import React from 'react';
import { Map, List } from 'immutable';
import { setDateToTimezone } from '@carecru/isomorphic';
import DayViewBody from './DayViewBody';
import { DateTimeObj } from '../../library';

function DayView(props) {
  const {
    currentDate,
    practitioners,
    patients,
    appointments,
    events,
    services,
    chairs,
    schedule,
    selectAppointment,
    leftColumnWidth,
  } = props;

  const pracColumns = {};
  const chairColumns = {};

  const filteredAppointments = appointments
    .get('models')
    .toArray()
    .filter((app) => {
      const startDate = setDateToTimezone(app.startDate);
      const isSameDate = startDate.isSame(currentDate, 'day');

      if (!app.isDeleted && isSameDate && !app.isCancelled && !app.isPending) {
        pracColumns[app.practitionerId] = true;
        chairColumns[app.chairId] = true;
        return app;
      }

      return false;
    });

  const filteredEvents = events
    .get('models')
    .toArray()
    .filter((evt) => {
      const startDate = setDateToTimezone(evt.startDate);
      const isSameDate = startDate.isSame(currentDate, 'day');

      if (isSameDate) {
        pracColumns[evt.practitionerId] = true;
        chairColumns[evt.chairId] = true;
        return evt;
      }

      return false;
    });

  const filteredChairs = filteredAppointments.length
    ? chairs.get('models').filter(ch => chairColumns[ch.id])
    : chairs.get('models');

  const filteredPracs = filteredAppointments.length
    ? practitioners.filter(prac => pracColumns[prac.id])
    : practitioners;

  return (
    <DayViewBody
      schedule={schedule}
      selectAppointment={selectAppointment}
      appointments={filteredAppointments}
      events={filteredEvents}
      chairs={filteredChairs}
      services={services.get('models')}
      patients={patients.get('models')}
      practitioners={filteredPracs}
      startHour={4}
      endHour={23}
      leftColumnWidth={leftColumnWidth}
    />
  );
}

DayView.propTypes = {
  appointments: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  events: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  patients: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  services: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  chairs: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
  currentDate: PropTypes.instanceOf(DateTimeObj).isRequired,
  schedule: PropTypes.instanceOf(Map).isRequired,
  selectAppointment: PropTypes.func.isRequired,
  leftColumnWidth: PropTypes.number.isRequired,
};

export default DayView;
