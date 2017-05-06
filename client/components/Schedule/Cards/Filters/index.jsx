
import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';
import FiltersAll from './FiltersAll';

export default function Filters(props) {
  const {
    practitioners,
    schedule,
    services,
    chairs,
  } = props;

  const selectedFilters = {
    practitionersFilter: schedule.toJS().practitionersFilter,
    servicesFilter: schedule.toJS().servicesFilter,
    chairsFilter: schedule.toJS().chairsFilter,
  };

  const entities = {
    practitionersFilter: practitioners,
    servicesFilter: services,
    chairsFilter: chairs,
  };

  const allFiltersCheck = {
    practitionersFilter: false,
    servicesFilter: false,
    chairsFilter: false,
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

Filters.PropTypes = {
  addPractitionerToFilter: PropTypes.func,
  selectAppointmentType: PropTypes.func,
  removePractitionerFromFilter: PropTypes.func,
  addServiceFilter: PropTypes.func,
};

