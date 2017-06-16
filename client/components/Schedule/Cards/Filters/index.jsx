
import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import styles from './styles.scss';
import FiltersAll from './FiltersAll';

export default function Filters(props) {
  const {
    practitioners,
    schedule,
    services,
    chairs,
  } = props;

  const practitionersFilter = schedule.toJS().practitionersFilter;

  const selectedFilters = {
    chairsFilter: schedule.toJS().chairsFilter,
    practitionersFilter: schedule.toJS().practitionersFilter,
    servicesFilter: schedule.toJS().servicesFilter,
    remindersFilter: schedule.toJS().remindersFilter,
  };

  let filteredServices = [];

  if (practitionersFilter.length) {
    practitionersFilter.map((pracId) => {
      if (pracId) {
        const selectedPrac = practitioners.get(pracId);
        const serviceIds = selectedPrac ? selectedPrac.get('services') : [];
        serviceIds.map((sid) => {
          if(filteredServices.indexOf(services.get(sid)) === -1) {
            filteredServices.push(services.get(sid));
          }
        });
      }
    });
  }

  const entities = {
    chairsFilter: chairs,
    practitionersFilter: practitioners,
    servicesFilter: filteredServices,
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

