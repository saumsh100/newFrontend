
import React, { Component, PropTypes } from 'react';
import { Icon } from '../../../library';
import Demographics from './Demographics';
import Appointments from './Appointments';
import styles from './styles.scss';

class SideBarFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilters: [false, false],
    };
    this.displayFilter = this.displayFilter.bind(this);
    this.handleDemographics = this.handleDemographics.bind(this);
    this.handleAppointments = this.handleAppointments.bind(this);
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
        type: 'Demographics',
        values,
        index: 0,
      });
    }
  }

  handleAppointments(values) {
    const {
      firstApp1,
      firstApp2,
      lastApp1,
      lastApp2,
      app1,
      app2,
      app3,
      prod1,
      prod2,
      online1,
      online2,
      online3,
    } = values;


    if (((firstApp1 && firstApp2) || (!firstApp1 && !firstApp2)) &&
      ((lastApp1 && lastApp2) || (!lastApp1 && !lastApp2)) &&
      ((app1 && app2 && app3) || (!app1 && !app2 && !app3)) &&
      ((prod1 && prod2) || (!prod1 && !prod2)) &&
      ((online1 && online2 && online3) || (!online1 && !online2 && !online3))) {
      console.log(values)
      this.props.addFilter({
        type: 'Appointments',
        values,
        index: 1,
      });
    }
  }

  render() {
    const {
      openFilters,
    } = this.state;
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
        </div>
      </div>
    );
  }
}

export default SideBarFilters;
