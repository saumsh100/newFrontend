import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import styles from './styles.scss';
import FiltersAll from './FiltersAll';
import { DateTimeObj, getDate } from '../../../library';

export default function Filters(props) {
  const { practitioners, schedule, chairs, appointments, currentDate } = props;

  const pracColumns = {};
  const chairColumns = {};

  const filteredAppointments = appointments
    .get('models')
    .toArray()
    .filter((app) => {
      const startDate = getDate(app.startDate);
      const isSameDate = startDate.isSame(currentDate, 'day');

      if (!app.isDeleted && isSameDate && !app.isCancelled && !app.isPending) {
        pracColumns[app.practitionerId] = true;
        chairColumns[app.chairId] = true;
        return app;
      }
      return null;
    });

  const filteredChairs = filteredAppointments.length
    ? chairs.filter((ch) => chairColumns[ch.id])
    : chairs;
  const filteredPracs = filteredAppointments.length
    ? practitioners.filter((prac) => pracColumns[prac.id])
    : practitioners;

  const getOnlySelectedFilters = () => {
    const { chairsFilter, practitionersFilter } = schedule.toJS();
    return {
      chairsFilter: filteredChairs
        .toArray()
        .filter((chair) => chairsFilter.indexOf(chair.id) > -1)
        .map((chair) => chair.id),
      practitionersFilter: filteredPracs
        .toArray()
        .filter((chair) => practitionersFilter.indexOf(chair.id) > -1)
        .map((practitioner) => practitioner.id),
      remindersFilter: schedule.toJS().remindersFilter,
    };
  };
  const selectedFilters = getOnlySelectedFilters();

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
  practitioners: PropTypes.instanceOf(Map).isRequired,
  schedule: PropTypes.instanceOf(Map).isRequired,
  chairs: PropTypes.instanceOf(Map).isRequired,
  appointments: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  currentDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.instanceOf(DateTimeObj)])
    .isRequired,
};
