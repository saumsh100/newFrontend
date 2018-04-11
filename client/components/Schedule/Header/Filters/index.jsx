
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import moment from 'moment';
import styles from './styles.scss';
import FiltersAll from './FiltersAll';

export default function Filters(props) {
  const { practitioners, schedule, chairs, appointments, currentDate } = props;

  const pracColumns = {};
  const chairColumns = {};

  const filteredAppointments = appointments
    .get('models')
    .toArray()
    .filter((app) => {
      const startDate = moment(app.startDate);
      const isSameDate = startDate.isSame(currentDate, 'day');

      if (!app.isDeleted && isSameDate && !app.isCancelled && !app.isPending) {
        pracColumns[app.practitionerId] = true;
        chairColumns[app.chairId] = true;
        return app;
      }
      return null;
    });

  const filteredChairs = filteredAppointments.length
    ? chairs.filter(ch => chairColumns[ch.id])
    : chairs;
  const filteredPracs = filteredAppointments.length
    ? practitioners.filter(prac => pracColumns[prac.id])
    : practitioners;

  const selectedFilters = {
    chairsFilter: schedule.toJS().chairsFilter,
    practitionersFilter: schedule.toJS().practitionersFilter,
    remindersFilter: schedule.toJS().remindersFilter,
  };

  const entities = {
    chairsFilter: filteredChairs,
    practitionersFilter: filteredPracs,
    remindersFilter: [
      Map({ id: 'Reminder Sent' }),
      Map({ id: 'PMS Not Synced' }),
      Map({ id: 'Patient Confirmed' }),
    ],
  };

  const allFiltersCheck = {
    chairsFilter: true,
    practitionersFilter: true,
    servicesFilter: true,
    remindersFilter: true,
  };

  return (
    <FiltersAll
      selectedFilters={selectedFilters}
      entities={entities}
      allFiltersCheck={allFiltersCheck}
      className={styles.filter_options}
    />
  );
}

Filters.propTypes = {
  addPractitionerToFilter: PropTypes.func,
  selectAppointmentType: PropTypes.func,
  removePractitionerFromFilter: PropTypes.func,
  addServiceFilter: PropTypes.func,
  practitioners: PropTypes.instanceOf(Object),
  schedule: PropTypes.instanceOf(Object),
  chairs: PropTypes.instanceOf(Object),
  appointments: PropTypes.instanceOf(Object),
  currentDate: PropTypes.date,
};
