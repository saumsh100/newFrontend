
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
    const {
      addFilter,
    } = this.props;

    if ((values.ageStart && values.ageEnd) || (!values.ageStart && !values.ageEnd)) {
      addFilter({
        indexFunc: 0,
        data: values,
        tab: 'Demographics',
        intensive: false,
      });
    }
  }

  handleAppointments(values) {
    const {
      addFilter,
    } = this.props;

    const keys = Object.keys(values);

    let setFilter = 0;
    const batchFilters = [];

    keys.forEach((key) => {
      if (key === 'firstAppointment' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 1,
          data: values.firstAppointment,
          key: 'firstApptDate',
          tab: 'First Appointment',
          intensive: false,
        });
      }
      if (key === 'lastAppointment' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 1,
          data: values.lastAppointment,
          key: 'lastApptDate',
          tab: 'Last Appointment',
          intensive: false,
        });
      }
      if (key === 'appointmentsCount' && values[key].length === 3) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 2,
          data: values.appointmentsCount,
          tab: 'Number of Appointments',
          intensive: true,
        });
      }
      if (key === 'production' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 3,
          data: values.production,
          tab: 'Production',
          intensive: true,
        });
      }
      if (key === 'onlineAppointments' && values[key].length === 3) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 4,
          data: values.onlineAppointments,
          tab: 'Online Appointments',
          intensive: true,
        });
      }

    });

    if (keys.length === setFilter){
      batchFilters.forEach((filter) => {
        addFilter(filter);
      });
    }
  }

  handlePractitioners(values) {
    const {
      addFilter,
    } = this.props;

    if (values && values.practitioners.length === 1) {
      addFilter({
        indexFunc: 5,
        data: values.practitioners,
        tab: 'Practitioners',
        intensive: true,
      });
    }
  }

  handleCommunications(values) {
    const keys = Object.keys(values);

    const {
      addFilter,
    } = this.props;

    let setFilter = 0;
    const batchFilters = [];

    keys.forEach((key) => {
      if (key === 'remindersEmail' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 6,
          data: values.remindersEmail,
          tab: 'Reminders Email',
          key: 'phone',
        });
      }
      if (key === 'remindersSMS' && values[key].length === 2) {
        setFilter += 1;

        batchFilters.push({
          indexFunc: 7,
          data: values.remindersSMS,
          tab: 'Reminders SMS',
          key: 'sms',
        });
      }
      if (key === 'remindersPhone' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 8,
          data: values.remindersPhone,
          tab: 'Reminders Phone',
          key: 'phone',
        });
      }
      if (key === 'recallsEmail' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 9,
          data: values.recallsEmail,
          tab: 'Recalls Email',
          key: 'phone',
        });
      }
      if (key === 'recallsSMS' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 10,
          data: values.recallsSMS,
          tab: 'Recalls SMS',
          key: 'sms',
        });
      }
      if (key === 'recallsPhone' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 11,
          data: values.recallsPhone,
          tab: 'Recalls Phone',
          key: 'phone',
        });
      }
      if (key === 'lastReminderSent' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 12,
          data: values.lastReminderSent,
          tab: 'Last Reminder Sent',
        });
      }
      if (key === 'lastRecareSent' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 13,
          data: values.lastRecareSent,
          tab: 'Last Recare Sent',
        });
      }
      if (key === 'reviews' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 14,
          data: values.reviews,
          tab: 'Reviews',
        });
      }
    });

    if (keys.length === setFilter){
      batchFilters.forEach((filter) => {
        addFilter(filter);
      });
    }
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
