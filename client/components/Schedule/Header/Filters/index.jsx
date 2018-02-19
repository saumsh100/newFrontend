
import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import styles from './styles.scss';
import FiltersAll from './FiltersAll';

export default function Filters(props) {
  const {
    practitioners,
    schedule,
    chairs,
  } = props;


  const selectedFilters = {
    chairsFilter: schedule.toJS().chairsFilter,
    practitionersFilter: schedule.toJS().practitionersFilter,
    remindersFilter: schedule.toJS().remindersFilter,
  };

  const entities = {
    chairsFilter: chairs,
    practitionersFilter: practitioners,
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
};

