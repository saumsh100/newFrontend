
import React, { Component, PropTypes } from 'react';
import {
  Icon, Card
} from '../../../library';
import styles from './styles.scss';
import FiltersAll from './FiltersAll';

class Filters extends Component {
  render() {
    const {
      practitioners,
      schedule,
      services,
      chairs,
    } = this.props;


    const selectedFilters = {
      practitionersFilter: schedule.toJS().practitionersFilter,
      servicesFilter: schedule.toJS().servicesFilter,
      chairsFilter: schedule.toJS().chairsFilter,
    }

    const entities = {
      practitionersFilter: practitioners,
      servicesFilter: services,
      chairsFilter: chairs,
    }

    const allFiltersCheck = {
      practitionersFilter: true,
      servicesFilter: true,
      chairsFilter: true,
    }

    return (
      <Card className={styles.schedule_filter}>
        <div className={styles.filter_header}>
          <div className={styles.filter_header__title}>
            Filter
          </div>
          <div className={styles.filter_header__icon}>
            <Icon icon="sliders" />
          </div>
          <div className={styles.filter_header__link}>Clear All</div>
        </div>
        <div className={styles.filter_practitioner}>

          <div className={styles.filter_options}>
            <FiltersAll
             selectedFilters={selectedFilters}
             entities={entities}
             allFiltersCheck={allFiltersCheck}
             className={styles.filter_options}
            />
            <div className={styles.filter_options__item}>
              <div className={styles.filter_options__title}>Reminders:</div>
              <select disabled="disabled">
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

Filters.PropTypes = {
  addPractitionerToFilter: PropTypes.func,
  selectAppointmentType: PropTypes.func,
  removePractitionerFromFilter: PropTypes.func,
  addServiceFilter: PropTypes.func,
};

export default Filters;
