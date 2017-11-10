
import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { Icon } from '../../../library';
import Demographics from './Demographics';
import Appointments from './Appointments';
import Practitioners from './Practitioners';
import Communications from './Communications';
import FilterTags from './FilterTags';
import styles from './styles.scss';

class SideBarFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilters: [false, false, false, false],
      filterTags: Map(),
    };
    this.displayFilter = this.displayFilter.bind(this);
    this.handleDemographics = this.handleDemographics.bind(this);
    this.handleAppointments = this.handleAppointments.bind(this);
    this.handlePractitioners = this.handlePractitioners.bind(this);
    this.handleCommunications = this.handleCommunications.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.addTags = this.addTags.bind(this);
  }

  componentWillUpdate() {
    const {
      filters,
    } = this.props;

    const {
      filterTags,
    } = this.state;

    if (!filters.size && !filters.length && filterTags.size) {
      this.setState({
        filterTags: Map(),
        });
    }
  }

  displayFilter(index) {
    const {
      openFilters,
    } = this.state;

    const filterState = openFilters[index];
    const newFiltersState = openFilters;
    newFiltersState[index] = !filterState;

    this.setState({
      openFilters: newFiltersState,
    });
  }

  addTags(filters) {
    const {
      filterTags,
    } = this.state;

    let newFilters = Map();

    filters.forEach((filter) => {
      newFilters = filterTags.set(`${filter.indexFunc}`, filter);
    });


    this.setState({
      filterTags: newFilters,
    });
  }

  removeTag(filter) {
    const {
      filterTags,
    } = this.state;

    const {
      arrayRemoveAll,
      removeFilter,
    } = this.props;

    arrayRemoveAll(filter.formName, filter.formSection);

    removeFilter(filter.indexFunc);

    if (filterTags.size >= 1) {
      this.setState({
        filterTags: filterTags.delete(`${filter.indexFunc}`),
      });
    } else {
      this.setState({
        filterTags: Map(),
      });
    }
  }

  handleDemographics(values) {
    const {
      addFilter,
    } = this.props;

    let keys = Object.keys(values);

    let setFilter = 0;
    const batchFilters = [];

    keys = keys.filter((key) => {
      if (values[key] && values[key].length !== 0) {
        return key;
      }
    });

    keys.forEach((key) => {
      if (key === 'age' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 0,
          formName: 'demographics',
          formSection: key,
          key,
          data: values[key],
          tag: 'Age',
          intensive: false,
        });
      }
      if (key === 'gender' && values[key].length === 1) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 1,
          data: values[key],
          formName: 'demographics',
          formSection: key,
          key,
          tag: 'Gender',
          intensive: false,
        });
      }
      if (key === 'location' && values[key].length === 1) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 2,
          formName: 'demographics',
          formSection: key,
          data: values[key],
          key,
          tag: 'City',
          intensive: true,
        });
      }
    });

    if (keys.length === setFilter && keys.length > 0) {
      this.addTags(batchFilters);
      batchFilters.forEach((filter) => {
        addFilter(filter);
      });
    }
  }

  handleAppointments(values) {
    const {
      addFilter,
    } = this.props;

    let keys = Object.keys(values);

    let setFilter = 0;
    const batchFilters = [];
    
    keys = keys.filter((key) => {
      if (values[key] && values[key].length !== 0) {
        return key;
      }
    });

    keys.forEach((key) => {
      if (key === 'firstAppointment' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 3,
          formName: 'appointments',
          formSection: key,
          data: values.firstAppointment,
          key: 'firstApptDate',
          tag: 'First Appointment',
          intensive: false,
        });
      }
      if (key === 'lastAppointment' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 4,
          data: values.lastAppointment,
          formName: 'appointments',
          formSection: key,
          key: 'lastApptDate',
          tag: 'Last Appointment',
          intensive: false,
        });
      }
      if (key === 'appointmentsCount' && values[key].length === 3) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 5,
          formName: 'appointments',
          formSection: key,
          data: values.appointmentsCount,
          tag: 'Number of Appointments',
          intensive: true,
        });
      }
      if (key === 'production' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 6,
          formName: 'appointments',
          formSection: key,
          data: values.production,
          tag: 'Production',
          intensive: true,
        });
      }
      if (key === 'onlineAppointments' && values[key].length === 3) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 7,
          formName: 'appointments',
          formSection: key,
          data: values.onlineAppointments,
          tag: 'Online Appointments',
          intensive: true,
        });
      }
    });

    if (keys.length === setFilter && keys.length > 0) {
      this.addTags(batchFilters);
      batchFilters.forEach((filter) => {
        addFilter(filter);
      });
    }
  }

  handlePractitioners(values) {
    const {
      addFilter,
    } = this.props;

    let keys = Object.keys(values);
    keys = keys.filter((key) => {
      if (values[key] && values[key].length !== 0) {
        return key;
      }
    });
    keys.forEach((key) => {
      if (key && values[key].length === 1) {
        console.log('wpppp')
        const pracObj = {
          indexFunc: 8,
          data: values.practitioners,
          formName: 'practitioners',
          formSection: 'practitioners',
          tag: 'Practitioners',
          intensive: true,
        };
        this.addTags([pracObj]);
        addFilter(pracObj);
      }
    });
  }

  handleCommunications(values) {
    const {
      addFilter,
    } = this.props;

    let setFilter = 0;
    let keys = Object.keys(values);

    const batchFilters = [];

    keys = keys.filter((key) => {
      if (values[key] && values[key].length !== 0) {
        return key;
      }
    });

    keys.forEach((key) => {
      if (key === 'remindersEmail' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 9,
          data: values.remindersEmail,
          tag: 'Reminders Email',
          key: 'phone',
        });
      }
      if (key === 'remindersSMS' && values[key].length === 2) {
        setFilter += 1;

        batchFilters.push({
          indexFunc: 10,
          data: values.remindersSMS,
          tag: 'Reminders SMS',
          key: 'sms',
        });
      }
      if (key === 'remindersPhone' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 11,
          data: values.remindersPhone,
          tag: 'Reminders Phone',
          key: 'phone',
        });
      }
      if (key === 'recallsEmail' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 12,
          data: values.recallsEmail,
          tag: 'Recalls Email',
          key: 'phone',
        });
      }
      if (key === 'recallsSMS' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 13,
          data: values.recallsSMS,
          tag: 'Recalls SMS',
          key: 'sms',
        });
      }
      if (key === 'recallsPhone' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 14,
          data: values.recallsPhone,
          tag: 'Recalls Phone',
          key: 'phone',
        });
      }
      if (key === 'lastReminderSent' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 15,
          data: values.lastReminderSent,
          tag: 'Last Reminder Sent',
          intensive: true,
        });
      }
      if (key === 'lastRecareSent' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 16,
          data: values.lastRecareSent,
          tag: 'Last Recare Sent',
          intensive: true,
        });
      }
      if (key === 'reviews' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 17,
          data: values.reviews,
          tag: 'Reviews',
          intensive: true,
        });
      }
    });

    if (keys.length === setFilter && keys.length > 0){
      this.addTags(batchFilters);

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
      filterTags,
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

        <FilterTags
          filterTags={filterTags}
          removeTag={this.removeTag}
        />

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
