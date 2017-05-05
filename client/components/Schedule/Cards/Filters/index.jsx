
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Icon, Card
} from '../../../library';
import styles from './styles.scss';
import FilterServices from './FilterServices';
import FilterChairs from './FilterChairs';
import FilterPractitioners from './FilterPractitioners';
import {
  addScheduleFilter,
  removeScheduleFilter,
  clearScheduleFilter,
  addAllScheduleFilter,
} from '../../../../actions/schedule';


class Filters extends Component {
  constructor(props) {
    super(props);
    this.handleTypeFilter = this.handleTypeFilter.bind(this);
    this.handleCheckDoctor = this.handleCheckDoctor.bind(this);
    this.clearAllSelectors = this.clearAllSelectors.bind(this);
  }

  handleCheckDoctor(practitionerId, checked) {
    if (checked) {
      this.props.removePractitionerFromFilter(practitionerId);
    } else {
      this.props.addPractitionerToFilter(practitionerId);
    }
  }
  handleTypeFilter(type) {
    this.props.selectAppointmentType(type.target.value);
  }
  clearAllSelectors() {
    this.props.selectAppointmentType("all");
    this.refs.select.value = "all";
  }

  render() {
    const {
      practitioners,
      schedule,
      appointmentsTypes,
      services,
      chairs,
      addScheduleFilter,
      removeScheduleFilter,
      clearScheduleFilter,
      addAllScheduleFilter,
    } = this.props;

    const selectedFilterPractitioners = schedule.toJS().practitioners;
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
          <div onClick={this.clearAllSelectors} className={styles.filter_header__link}>Clear All</div>
        </div>
        <div className={styles.filter_practitioner}>
          <FilterPractitioners
            practitioners={practitioners}
            selectedFilterPractitioners={selectedFilterPractitioners}
            handleCheckDoctor={this.handleCheckDoctor}
          />
          <div className={styles.filter_options}>
            <FilterServices
              services={services}
              selectedFilterServices={selectedFilterServices}
              addScheduleFilter={addScheduleFilter}
              removeScheduleFilter={removeScheduleFilter}
              clearScheduleFilter={clearScheduleFilter}
              addAllScheduleFilter={addAllScheduleFilter}
            />
            <FilterChairs
              chairs={chairs}
              selectedFilterChairs={selectedFilterChairs}
              addScheduleFilter={addScheduleFilter}
              removeScheduleFilter={removeScheduleFilter}
              clearScheduleFilter={clearScheduleFilter}
              addAllScheduleFilter={addAllScheduleFilter}
            />
            <div className={styles.filter_options__item}>
              <div className={styles.filter_options__title}>Reminders:</div>
              <select disabled="disabled">
                <option value="all">All</option>
              </select>
            </div>
            <div className={styles.filter_options__item}>
              <div className={styles.filter_options__title}>Insurance:</div>
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


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addScheduleFilter,
    removeScheduleFilter,
    clearScheduleFilter,
    addAllScheduleFilter,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(Filters);
