
import React, { Component, PropTypes } from 'react';
import {
  Icon, Card
} from '../../../library';
import styles from './styles.scss';
import FiltersList from './FiltersList';
import FilterPractitioners from './FilterPractitioners';

class Filters extends Component {
  constructor(props) {
    super(props);
    this.handleCheckDoctor = this.handleCheckDoctor.bind(this);
  }

  handleCheckDoctor(practitionerId, checked) {
    if (checked) {
      this.props.removePractitionerFromFilter(practitionerId);
    } else {
      this.props.addPractitionerToFilter(practitionerId);
    }
  }

  render() {
    const {
      practitioners,
      schedule,
      appointmentsTypes,
      services,
      chairs,
    } = this.props;

    const selectedFilterPractitioners = schedule.toJS().practitionersFilter;
    const selectedFilterServices = schedule.toJS().servicesFilter;
    const selectedFilterChairs = schedule.toJS().chairsFilter;

    if(!services) {
      return null;
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
          <FiltersList
            key="FilterPractitioners"
            label="Practitioners"
            entities={practitioners}
            filterKey="practitionersFilter"
            selectedFilterItem={selectedFilterPractitioners}
            useCheckboxImage
            displayText="firstName"
          />
          <div className={styles.filter_options}>
            <FiltersList
              key="FilterServices"
              label="Services"
              entities={services}
              filterKey="servicesFilter"
              selectedFilterItem={selectedFilterServices}
              displayText="name"
            />
            <FiltersList
              key="FilterChairs"
              label="Chairs"
              entities={chairs}
              filterKey="chairsFilter"
              selectedFilterItem={selectedFilterChairs}
              displayText="name"
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
