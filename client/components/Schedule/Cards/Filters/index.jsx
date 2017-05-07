
import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';
import FiltersAll from './FiltersAll';

export default function Filters(props) {
  const {
    appointments,
    practitioners,
    schedule,
    services,
    chairs,
  } = props;

  const selectedFilters = {
    appointmentsFilter: schedule.toJS().appointmentsFilter,
    chairsFilter: schedule.toJS().chairsFilter,
    practitionersFilter: schedule.toJS().practitionersFilter,
    servicesFilter: schedule.toJS().servicesFilter,
  };

  const entities = {
    appointmentsFilter: appointments.filter((app) => app.get('isPatientConfirmed')),
    chairsFilter: chairs,
    practitionersFilter: practitioners,
    servicesFilter: services,
  };

  const allFiltersCheck = {
    appointmentsFilter: true,
    chairsFilter: true,
    practitionersFilter: true,
    servicesFilter: true,
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

