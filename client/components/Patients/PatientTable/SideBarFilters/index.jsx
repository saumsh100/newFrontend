
import React, { Component, PropTypes } from 'react';
import { Icon } from '../../../library';
import Demographics from './Demographics';
import Appointments from './Appointments';
import Practitioners from './Practitioners';
import Communications from './Communications';
import styles from './styles.scss';

class SideBarFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilters: [false, false, false, false],
    };
    this.displayFilter = this.displayFilter.bind(this);
    this.handleDemographics = this.handleDemographics.bind(this);
    this.handleAppointments = this.handleAppointments.bind(this);
    this.handlePractitioners = this.handlePractitioners.bind(this);
    this.handleCommunications = this.handleCommunications.bind(this);
  }

  displayFilter(index) {
    const {
      openFilters,
    } = this.state;

    const filterState = openFilters[index]
    const newFiltersState = openFilters;
    newFiltersState[index] = !filterState;

    this.setState({
      openFilters: newFiltersState,
    });
  }

  handleDemographics(values) {
    if ((values.ageStart && values.ageEnd) || (!values.ageStart && !values.ageEnd)) {
      this.props.addFilter({
        indexFunc: 0,
        data: values,
        tab: 'Demographics',
      });
    }
  }

  handleAppointments(values) {
    const {
      addFilter,
    } = this.props;

    const keys = Object.keys(values);

    let setFilter = 0;
    keys.forEach((key) => {
      if (key === 'firstAppointment' && values[key].length === 2) {
        addFilter({
          indexFunc: 1,
          data: values.firstAppointment,
          key: 'firstApptDate',
          tab: 'First Appointment',
        });
      }
      if (key === 'lastAppointment' && values[key].length === 2) {
        addFilter({
          indexFunc: 1,
          data: values.lastAppointment,
          key: 'lastApptDate',
          tab: 'Last Appointment',
        });
      }
      if (key === 'appointmentsCount' && values[key].length === 3) {
        addFilter({
          indexFunc: 2,
          data: values.appointmentsCount,
          tab: 'Number of Appointments',
        });
      }
      if (key === 'production' && values[key].length === 2) {
        addFilter({
          indexFunc: 3,
          data: values.production,
          tab: 'Production',
        });
      }
      if (key === 'onlineAppointments' && values[key].length === 3) {
        setFilter += 1;
      }
      if (key === 'treatment') {
        setFilter += 1;
      }
    });

  }

  handlePractitioners(values) {
    console.log(values);
  }

  handleCommunications(values) {
    console.log(values);
  }

  render() {
    const {
      practitioners,
    } = this.props;

    const {
      openFilters,
    } = this.state;

    if (!practitioners) {
      return null;
    }

    return (
      <div className={styles.sideBar}>
        <div className={styles.header}>
          <div className={styles.header_icon}> <Icon icon="sliders" /> </div>
          <div className={styles.header_text}> Filters </div>
        </div>
        <div className={styles.filtersContainer}>
          <div className={styles.filterBody}>
            <div
              className={styles.filterHeader}
              onClick={() => this.displayFilter(0)}
            >
              Demographics
              <span className={styles.filterHeader_icon}> <Icon icon="caret-down" /> </span>
            </div>
            {openFilters[0] ? <div className={styles.collapsible}>
              <Demographics
                handleDemographics={this.handleDemographics}
              />
            </div> : null}
          </div>

          <div className={styles.filterBody}>
            <div
              className={styles.filterHeader}
              onClick={() => this.displayFilter(1)}
            >
              Appointments
              <span className={styles.filterHeader_icon}> <Icon icon="caret-down" /> </span>
            </div>
            {openFilters[1] ? <div className={styles.collapsible}>
              <Appointments
                handleAppointments={this.handleAppointments}
              />
            </div> : null }
          </div>

          <div className={styles.filterBody}>
            <div
              className={styles.filterHeader}
              onClick={() => this.displayFilter(2)}
            >
              Practitioners
              <span className={styles.filterHeader_icon}> <Icon icon="caret-down" /> </span>
            </div>

            {openFilters[2] ? <div className={styles.collapsible}>
              <Practitioners
                handlePractitioners={this.handlePractitioners}
                practitioners={practitioners}
              />
            </div> : null }
          </div>

          <div className={styles.filterBody}>
            <div
              className={styles.filterHeader}
              onClick={() => this.displayFilter(3)}
            >
              Communications
              <span className={styles.filterHeader_icon}> <Icon icon="caret-down" /> </span>
            </div>

            {openFilters[3] ? <div className={styles.collapsible}>
              <Communications
                handleCommunications={this.handleCommunications}
                practitioners={practitioners}
              />
            </div> : null }
          </div>
        </div>
      </div>
    );
  }
}

export default SideBarFilters;
